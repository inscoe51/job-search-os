import type { AnalysisSessionRepository } from "@/lib/repository/analysis-session-repository";
import type { AnalysisSession } from "@/lib/validation/schemas";
import { analysisSessionSchema } from "@/lib/validation/schemas";

const SESSION_STORAGE_KEY = "job-search-os:analysis-sessions";

function readSessions(): AnalysisSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed.map((item) => analysisSessionSchema.parse(item));
  } catch {
    return [];
  }
}

function writeSessions(sessions: AnalysisSession[]) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

export class BrowserAnalysisSessionRepository implements AnalysisSessionRepository {
  save(session: AnalysisSession): AnalysisSession {
    const sessions = readSessions();
    writeSessions([
      session,
      ...sessions.filter((item) => item.sessionId !== session.sessionId)
    ]);
    return session;
  }

  get(sessionId: string): AnalysisSession | null {
    return readSessions().find((session) => session.sessionId === sessionId) ?? null;
  }

  remove(sessionId: string): void {
    writeSessions(readSessions().filter((session) => session.sessionId !== sessionId));
  }
}

export function createBrowserAnalysisSessionRepository(): AnalysisSessionRepository {
  return new BrowserAnalysisSessionRepository();
}
