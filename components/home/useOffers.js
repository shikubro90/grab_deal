export function endsLabel(d) {
  if (!d) return "";
  const days = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (days <= 0) return "Ends today";
  if (days === 1) return "Ends tomorrow";
  if (days <= 7) return `Ends in ${days} days`;
  return `Ends ${new Date(d).toLocaleDateString("en-GB")}`;
}

export function SectionHeader({ title, href, linkLabel = "View All" }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
      <h2 className="text-xl font-extrabold text-foreground sm:text-3xl">{title}</h2>
      {href && (
        <a href={href} className="shrink-0 whitespace-nowrap py-2 text-sm font-bold text-primary hover:underline">
          {linkLabel} →
        </a>
      )}
    </div>
  );
}

export function Skeletons({ count, className }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className={`animate-pulse rounded-2xl bg-muted ${className}`} />
  ));
}

export function EmptyState({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
