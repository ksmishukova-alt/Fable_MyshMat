import type { SubjectStatus, TaskMode } from "@/types/domain";

/** Внешний вид чипа статуса предмета на главном экране. */
export interface StatusChip {
  label: string;
  /** ключ цветовой темы чипа */
  tone: "green" | "orange" | "blue" | "gray";
  /** показывать ли точку-иконку слева */
  dot?: string;
}

export function statusToChip(status: SubjectStatus): StatusChip {
  switch (status) {
    case "successful":
    case "perfect":
      return { label: "Готово", tone: "green", dot: "✓" };
    case "submitted":
      return { label: "Ждёт проверку взрослого", tone: "orange", dot: "›" };
    case "needsRevision":
      return { label: "Нужно доработать", tone: "orange", dot: "!" };
    case "inProgress":
      return { label: "Продолжить", tone: "blue" };
    case "notStarted":
    default:
      return { label: "Можно начать", tone: "blue" };
  }
}

/** Подпись пиктограммы режима задания. */
export function modeLabel(mode: TaskMode): string {
  return mode === "platform" ? "на платформе" : "на листочке";
}

export function modeIcon(mode: TaskMode): string {
  return mode === "platform" ? "🖥️" : "✏️";
}

/**
 * Русское склонение существительного по числу.
 * plural(1,["предмет","предмета","предметов"]) → "предмет"
 * plural(2,...) → "предмета", plural(5,...) → "предметов"
 */
export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

/** Глагол «остался/осталось» по числу. */
export function leftVerb(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  return mod10 === 1 && mod100 !== 11 ? "Остался" : "Осталось";
}
