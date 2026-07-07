import { notFound } from "next/navigation";
import { topicById } from "@/lib/olympiad-bank";
import { OlympiadTopicScreen } from "@/components/OlympiadTopicScreen";
import "./olympiad.css";

export default async function OlympiadTopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = topicById(topicId);
  if (!topic) notFound();

  return <OlympiadTopicScreen topicId={topic.id} topicTitle={topic.title} />;
}
