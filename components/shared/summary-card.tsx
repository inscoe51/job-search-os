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
    <div className="app-card min-w-0 p-4 sm:p-5">
      <p className="app-mini-label">
        {label}
      </p>
      <p
        className={`mt-3 min-w-0 whitespace-normal break-words text-[15px] font-semibold leading-7 text-ink/88 [overflow-wrap:anywhere] ${
          valueClassName ?? ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
