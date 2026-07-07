import { notFound } from "next/navigation";
import { fetchTaskContent, fetchNextTaskId } from "@/lib/data";
import { TaskScreen } from "@/components/TaskScreen";
import "./task.css";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ subject: string; task: string }>;
}) {
  const { task: taskId } = await params;
  const task = await fetchTaskContent(taskId);
  if (!task) notFound();

  const nextTaskId = await fetchNextTaskId(task.subjectId, task.id);

  return <TaskScreen task={task} nextTaskId={nextTaskId} />;
}
