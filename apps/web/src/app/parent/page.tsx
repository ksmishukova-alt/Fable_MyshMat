import { getSession } from "@/lib/session";
import { ParentPanel } from "@/components/ParentPanel";
import "./parent.css";

/** Кабинет родителя (доступ гарантирует middleware). */
export default async function ParentPage() {
  const session = await getSession();
  return <ParentPanel name={session?.name ?? "Родитель"} />;
}
