/**
 * МышМат — ЮKassa. Ключи в env (YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY).
 * Без ключей — тестовый режим: платёж эмулируется, подписка продлевается сразу.
 */
import { getSupabase } from "@/lib/supabase";

const API = "https://api.yookassa.ru/v3";

export function yookassaConfigured(): boolean {
  return !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

function authHeader(): string {
  const raw = `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

export const MONTHLY_PRICE_RUB = 990;

/** Продлить подписку на 30 дней от максимума(сегодня, paid_until). */
export async function extendSubscription(parentId: string): Promise<void> {
  const db = getSupabase();
  if (!db) return;
  const { data } = await db
    .from("subscriptions")
    .select("paid_until")
    .eq("parent_id", parentId)
    .maybeSingle();
  const base =
    data?.paid_until && data.paid_until > new Date().toISOString().slice(0, 10)
      ? new Date(data.paid_until + "T00:00:00Z")
      : new Date();
  base.setDate(base.getDate() + 30);
  await db.from("subscriptions").upsert({
    parent_id: parentId,
    status: "active",
    plan: "monthly",
    paid_until: base.toISOString().slice(0, 10),
  });
}

/** Создать платёж. Возвращает URL подтверждения или test:true (эмуляция). */
export async function createPayment(
  parentId: string,
  returnUrl: string,
): Promise<{ url?: string; test?: boolean; error?: string }> {
  const db = getSupabase();

  if (!yookassaConfigured()) {
    // тестовый режим: сразу «успех»
    if (db) {
      await db.from("payments").insert({
        parent_id: parentId,
        amount_rub: MONTHLY_PRICE_RUB,
        status: "succeeded",
        yookassa_id: `test-${Date.now()}`,
      });
      await extendSubscription(parentId);
    }
    return { test: true };
  }

  let paymentRowId: string | null = null;
  if (db) {
    const { data } = await db
      .from("payments")
      .insert({ parent_id: parentId, amount_rub: MONTHLY_PRICE_RUB, status: "pending" })
      .select("id")
      .single();
    paymentRowId = data?.id ?? null;
  }

  try {
    const res = await fetch(`${API}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
        "Idempotence-Key": paymentRowId ?? crypto.randomUUID(),
      },
      body: JSON.stringify({
        amount: { value: `${MONTHLY_PRICE_RUB}.00`, currency: "RUB" },
        capture: true,
        confirmation: { type: "redirect", return_url: returnUrl },
        description: "МышМат: подписка на месяц",
        metadata: { parentId, paymentRowId },
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json()) as {
      id?: string;
      confirmation?: { confirmation_url?: string };
      description?: string;
    };
    if (!res.ok || !data.confirmation?.confirmation_url) {
      return { error: data.description ?? "ЮKassa: не удалось создать платёж" };
    }
    if (db && paymentRowId) {
      await db.from("payments").update({ yookassa_id: data.id }).eq("id", paymentRowId);
    }
    return { url: data.confirmation.confirmation_url };
  } catch {
    return { error: "ЮKassa недоступна, попробуйте позже" };
  }
}

/** Обработка webhook payment.succeeded (с верификацией через API). */
export async function handleWebhook(body: {
  event?: string;
  object?: { id?: string; metadata?: { parentId?: string; paymentRowId?: string } };
}): Promise<boolean> {
  if (body.event !== "payment.succeeded" || !body.object?.id) return false;
  const paymentId = body.object.id;

  // верифицируем: событие могло быть подделано — спрашиваем ЮKassa напрямую
  if (yookassaConfigured()) {
    try {
      const res = await fetch(`${API}/payments/${paymentId}`, {
        headers: { Authorization: authHeader() },
        signal: AbortSignal.timeout(10000),
      });
      const data = (await res.json()) as { status?: string; metadata?: { parentId?: string } };
      if (data.status !== "succeeded") return false;
      const parentId = data.metadata?.parentId ?? body.object.metadata?.parentId;
      if (!parentId) return false;
      const db = getSupabase();
      if (db) {
        await db
          .from("payments")
          .update({ status: "succeeded" })
          .eq("yookassa_id", paymentId);
      }
      await extendSubscription(parentId);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
