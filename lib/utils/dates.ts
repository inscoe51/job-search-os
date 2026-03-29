export function nowIso(): string {
  return new Date().toISOString();
}

export function todayDateValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateLabel(value: string | null): string {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}
