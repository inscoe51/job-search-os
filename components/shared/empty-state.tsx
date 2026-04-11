import Link from "next/link";

type EmptyStateProps = {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel
}: EmptyStateProps) {
  return (
    <div className="app-panel border-dashed p-10 text-center">
      <p className="app-kicker">MVP state</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/72">{body}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="app-button-primary mt-6"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
