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
    <div className="rounded-3xl border border-dashed border-ink/20 bg-panel p-10 text-center shadow-card">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/70">{body}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white no-underline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
