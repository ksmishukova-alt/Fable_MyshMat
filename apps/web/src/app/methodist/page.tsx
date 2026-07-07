import { getSession } from "@/lib/session";
import { MethodistPanel } from "@/components/MethodistPanel";
import "./methodist.css";

/** Кабинет методиста (доступ гарантирует middleware). */
export default async function MethodistPage() {
  const session = await getSession();
  return <MethodistPanel name={session?.name ?? "Методист"} />;
}
