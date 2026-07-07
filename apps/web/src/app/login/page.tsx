"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./login.css";

const PIN_LEN = 4;

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<"child" | "adult">("child");
  const [login, setLogin] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(body: Record<string, string>) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не получилось войти");
        setPin("");
        return;
      }
      const next = params.get("next");
      router.push(data.role === "child" && next ? next : data.home);
      router.refresh();
    } catch {
      setError("Нет связи. Попробуй ещё раз");
    } finally {
      setBusy(false);
    }
  }

  function pressKey(k: string) {
    if (busy) return;
    if (k === "⌫") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    const next = (pin + k).slice(0, PIN_LEN);
    setPin(next);
    if (next.length === PIN_LEN && login.trim()) {
      void submit({ mode: "child", login, pin: next });
    }
  }

  return (
    <main className="login-stage">
      <div className="login-card">
        <div className="login-logo">
          Мыш<span>Мат</span>
        </div>
        <div className="login-mascot" aria-hidden="true" />

        <div className="login-tabs" role="tablist" aria-label="Кто входит">
          <button
            role="tab"
            aria-selected={tab === "child"}
            className="login-tab"
            onClick={() => {
              setTab("child");
              setError("");
            }}
          >
            Я ученик
          </button>
          <button
            role="tab"
            aria-selected={tab === "adult"}
            className="login-tab"
            onClick={() => {
              setTab("adult");
              setError("");
            }}
          >
            Я взрослый
          </button>
        </div>

        {tab === "child" ? (
          <>
            <div className="login-field">
              <label htmlFor="child-login">Твой логин</label>
              <input
                id="child-login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="например, artem"
                autoComplete="username"
                autoCapitalize="none"
              />
            </div>
            <div className="pin-dots" aria-label={`PIN: введено ${pin.length} из ${PIN_LEN}`}>
              {Array.from({ length: PIN_LEN }, (_, i) => (
                <span key={i} className={`pin-dot${i < pin.length ? " filled" : ""}`} />
              ))}
            </div>
            <div className="pin-pad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => (
                <button key={k} className="pin-key" onClick={() => pressKey(k)}>
                  {k}
                </button>
              ))}
              <span />
              <button className="pin-key" onClick={() => pressKey("0")}>
                0
              </button>
              <button className="pin-key ghost" onClick={() => pressKey("⌫")} aria-label="Стереть">
                ⌫
              </button>
            </div>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit({ mode: "adult", email, password });
            }}
          >
            <div className="login-field">
              <label htmlFor="adult-email">Электронная почта</label>
              <input
                id="adult-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="login-field">
              <label htmlFor="adult-pass">Пароль</label>
              <input
                id="adult-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button className="btn-cta btn-cta--blue login-submit" disabled={busy} type="submit">
              {busy ? "Входим…" : "Войти"}
            </button>
          </form>
        )}

        <div className="login-error" role="alert">
          {error}
        </div>
        <div className="login-hint">
          Демо: ученик <b>artem</b> / PIN <b>1234</b> · методист <b>metodist@myshmat.ru</b> /{" "}
          <b>demo1234</b>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
