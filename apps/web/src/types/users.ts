/**
 * МышМат — роли и доступ.
 * Ребёнок: логин + PIN. Взрослые: email + пароль.
 * Самореги нет — методист создаёт родителей и детей в своём кабинете.
 */

export type Role = "child" | "parent" | "methodist";

export interface ChildAccount {
  id: string;
  login: string; // логин для входа
  name: string;
  grade: number;
  parentId: string;
  methodistId: string;
  avatarUrl?: string;
  /** Отключённые предметы Daily (методист регулирует набор). */
  disabledSubjects: string[];
  createdAt: string;
}

export interface ParentAccount {
  id: string;
  email: string;
  name: string;
  childIds: string[];
  telegramChatId?: string;
  createdAt: string;
}

export interface MethodistAccount {
  id: string;
  email: string;
  name: string;
  telegramChatId?: string;
  createdAt: string;
}

/** Полезная нагрузка JWT-сессии. */
export interface SessionPayload {
  role: Role;
  userId: string;
  name: string;
}

/** Расписание Daily ребёнка: назначенные методистом даты (ISO). */
export interface DailySchedule {
  childId: string;
  dates: string[];
}

/** Узел индивидуального плана: тема + порядок (переопределяет шаблон). */
export interface PlanNode {
  topicId: string;
  order: number;
}

export interface ChildPlan {
  childId: string;
  nodes: PlanNode[];
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// Подписка (ЮKassa)
// ─────────────────────────────────────────────────────────────

export type SubscriptionStatus = "trial" | "active" | "expired" | "canceled";

export interface Subscription {
  parentId: string;
  status: SubscriptionStatus;
  paidUntil: string | null;
  plan: "monthly" | "school";
}

export interface Payment {
  id: string;
  parentId: string;
  amountRub: number;
  status: "pending" | "succeeded" | "canceled";
  yookassaId?: string;
  createdAt: string;
}
