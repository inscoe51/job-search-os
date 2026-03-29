import { AnalysisSessionView } from "@/components/analysis/analysis-session-view";

type AnalysisPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { sessionId } = await params;
  return <AnalysisSessionView sessionId={sessionId} />;
}
