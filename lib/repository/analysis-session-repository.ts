import type { AnalysisSession } from "@/lib/validation/schemas";

export interface AnalysisSessionRepository {
  save(session: AnalysisSession): AnalysisSession;
  get(sessionId: string): AnalysisSession | null;
  remove(sessionId: string): void;
}
