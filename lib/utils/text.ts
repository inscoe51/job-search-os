export function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeOptionalText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function normalizeList(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

export function parseListInput(value: string): string[] {
  return normalizeList(
    value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

export function includesNormalized(text: string, candidate: string): boolean {
  return normalizeText(text).includes(normalizeText(candidate));
}

export function collectCorpus(values: Array<string | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
