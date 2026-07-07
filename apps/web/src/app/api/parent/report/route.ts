import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listChildrenForParent, buildParentReport, subscriptionStatus } from "@/lib/parent-repo";

/** GET /api/parent/report[?child=uuid] — дети, подписка и отчёт по выбранному ребёнку. */
export async function GET(req: Request) {
  const s = await getSession();
  if (s?.role !== "parent") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const children = await listChildrenForParent(s.userId);
  const url = new URL(req.url);
  const wanted = url.searchParams.get("child");
  const child = children.find((c) => c.id === wanted) ?? children[0];

  return NextResponse.json({
    children,
    subscription: await subscriptionStatus(s.userId),
    childId: child?.id ?? null,
    report: child ? await buildParentReport(child.id) : null,
  });
}
