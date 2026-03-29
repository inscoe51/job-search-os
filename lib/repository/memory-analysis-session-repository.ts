import type { AnalysisSessionRepository } from "@/lib/repository/analysis-session-repository";
import type { AnalysisSession } from "@/lib/validation/schemas";

export class MemoryAnalysisSessionRepository implements AnalysisSessionRepository {
  constructor(private sessions: AnalysisSession[] = []) {}

  save(session: AnalysisSession): AnalysisSession {
    this.sessions = [session, ...this.sessions.filter((item) => item.sessionId !== session.sessionId)];
    return session;
  }

  get(sessionId: string): AnalysisSession | null {
    return this.sessions.find((session) => session.sessionId === sessionId) ?? null;
  }

  remove(sessionId: string): void {
    this.sessions = this.sessions.filter((session) => session.sessionId !== sessionId);
  }
}
