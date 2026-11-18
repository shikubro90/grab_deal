import Link from "next/link";
import { SectionHeader, EmptyState } from "./useOffers";

export default function PopularOffers({ items }) {
  const loading = false, error = false;
  const offers = [...items]
    .sort((a, b) => b.discount - a.discount || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <section className="mx-auto mt-8 max-w-7xl sm:mt-12 px-4 lg:px-8">
      <SectionHeader title="Popular Offers of the Day" href="/offer" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {offers.map((o) => (
          <Link
            key={o._id}
            href={`/offer/${o._id}`}
            className="group flex flex-col justify-between min-w-0 rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <span className="inline-block rounded-full bg-muted max-w-full truncate px-2 py-0.5 text-[11px] font-bold text-primary sm:px-3 sm:py-1 sm:text-xs">
                {o.category || "Offer"}
              </span>
              <h3 className="mt-2 line-clamp-2 text-sm font-extrabold sm:mt-3 sm:text-base text-card-foreground">{o.title}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:text-sm">{o.discount ? `Up to ${o.discount}% OFF` : o.name}</p>
            </div>
            <span
              className="mt-3 flex min-h-11 items-center justify-center rounded-lg text-center sm:mt-4 text-sm font-bold text-primary-foreground"
              style={{ background: "var(--brand-gradient)" }}
            >
              Grab Now
            </span>
          </Link>
        ))}
      </div>
      {!loading && offers.length === 0 && (
        <EmptyState>{error ? "Could not load offers right now." : "No popular offers today."}</EmptyState>
      )}
    </section>
  );
}
