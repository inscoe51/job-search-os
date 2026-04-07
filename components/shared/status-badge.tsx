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
  apply_now: "bg-accent/15 text-accent",
  applied: "bg-accent/15 text-accent",
  interviewing: "bg-accent/15 text-accent",
  offer: "bg-accent/15 text-accent",
  passed: "bg-danger/15 text-danger",
  withdrawn: "bg-danger/15 text-danger",
  hold_for_networking: "bg-caution/15 text-caution",
  hold_for_variant: "bg-caution/15 text-caution",
  follow_up_due: "bg-caution/15 text-caution",
  apply: "bg-accent/15 text-accent",
  apply_with_caution: "bg-caution/15 text-caution",
  hold: "bg-caution/15 text-caution",
  pass: "bg-danger/15 text-danger",
  partial: "bg-caution/15 text-caution",
  fail: "bg-danger/15 text-danger",
  unknown: "bg-ink/10 text-ink",
  strong_fit: "bg-accent/15 text-accent",
  workable_fit: "bg-caution/15 text-caution",
  stretch_fit: "bg-caution/15 text-caution",
  low_fit: "bg-danger/15 text-danger",
  green_light: "bg-accent/15 text-accent",
  yellow_light: "bg-caution/15 text-caution",
  red_light: "bg-danger/15 text-danger",
  freelance_better: "bg-danger/15 text-danger"
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
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        toneMap[value] ?? "bg-ink/10 text-ink"
      }`}
    >
      {label}
    </span>
  );
}
