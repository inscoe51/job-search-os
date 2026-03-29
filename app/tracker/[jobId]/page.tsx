import { TrackerRecordPanel } from "@/components/tracker/tracker-record-panel";

type TrackerDetailPageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function TrackerDetailPage({
  params
}: TrackerDetailPageProps) {
  const { jobId } = await params;
  return <TrackerRecordPanel jobId={jobId} />;
}
