import {
  getApplicationStatusLabel,
  getNetworkingStatusLabel,
  type ApplicationStatus,
  type NetworkingStatus
} from "@/lib/domain/tracker-status";

type StatusBadgeProps = {
  value: string;
  kind?: "application" | "networking" | "fit" | "life";
};

const toneMap: Record<string, string> = {
  apply_now: "border-accent/15 bg-accent-soft text-accent-strong",
  applied: "border-accent/15 bg-accent-soft text-accent-strong",
  interviewing: "border-accent/15 bg-accent-soft text-accent-strong",
  offer: "border-accent/15 bg-accent-soft text-accent-strong",
  passed: "border-danger/15 bg-danger-soft text-danger",
  withdrawn: "border-danger/15 bg-danger-soft text-danger",
  hold_for_networking: "border-caution/15 bg-caution-soft text-caution",
  hold_for_variant: "border-caution/15 bg-caution-soft text-caution",
  follow_up_due: "border-caution/15 bg-caution-soft text-caution",
  apply: "border-accent/15 bg-accent-soft text-accent-strong",
  apply_with_caution: "border-caution/15 bg-caution-soft text-caution",
  hold: "border-caution/15 bg-caution-soft text-caution",
  pass: "border-danger/15 bg-danger-soft text-danger",
  partial: "border-caution/15 bg-caution-soft text-caution",
  fail: "border-danger/15 bg-danger-soft text-danger",
  unknown: "border-line bg-surface/85 text-ink",
  strong_fit: "border-accent/15 bg-accent-soft text-accent-strong",
  workable_fit: "border-caution/15 bg-caution-soft text-caution",
  stretch_fit: "border-caution/15 bg-caution-soft text-caution",
  low_fit: "border-danger/15 bg-danger-soft text-danger",
  green_light: "border-accent/15 bg-accent-soft text-accent-strong",
  yellow_light: "border-caution/15 bg-caution-soft text-caution",
  red_light: "border-danger/15 bg-danger-soft text-danger",
  freelance_better: "border-danger/15 bg-danger-soft text-danger"
};

export function StatusBadge({ value, kind = "application" }: StatusBadgeProps) {
  const label =
    kind === "application"
      ? getApplicationStatusLabel(value as ApplicationStatus) ?? value
      : kind === "networking"
        ? getNetworkingStatusLabel(value as NetworkingStatus) ?? value
        : value.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        toneMap[value] ?? "border-line bg-surface/85 text-ink"
      }`}
      style={{ fontFamily: '"Aptos", "Segoe UI", sans-serif' }}
    >
      {label}
    </span>
  );
}
