import type { ReactNode } from "react";

type SummaryCardProps = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

export function SummaryCard({
  label,
  value,
  valueClassName
}: SummaryCardProps) {
  return (
    <div className="app-card min-w-0 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
        {label}
      </p>
      <p
        className={`mt-2 min-w-0 whitespace-normal break-words text-sm font-semibold leading-6 text-ink/85 [overflow-wrap:anywhere] ${
          valueClassName ?? ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
