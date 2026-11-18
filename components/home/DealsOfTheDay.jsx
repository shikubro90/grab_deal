import Link from "next/link";
import SmartImage from "../cards/SmartImage";
import { SectionHeader, EmptyState } from "./useOffers";

export default function DealsOfTheDay({ items }) {
  const loading = false, error = false;
  const deals = items.filter((o) => o.image).sort((a, b) => b.discount - a.discount).slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:pb-12 lg:px-8">
      <SectionHeader title="Deals Of The Day" href="/offer" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {deals.map((o) => (
          <Link
            key={o._id}
            href={`/offer/${o._id}`}
            className="group min-w-0 overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-28 sm:h-44 overflow-hidden bg-muted">
              <SmartImage src={o.image} alt={o.title || "Deal"} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
              {o.discount > 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 sm:left-3 sm:top-3 sm:px-3 sm:py-1 text-xs font-bold text-primary-foreground">
                  {o.discount}% OFF
                </span>
              )}
            </div>
            <div className="p-2.5 sm:p-4">
              <h3 className="line-clamp-2 min-h-10 text-sm font-extrabold text-card-foreground">{o.title}</h3>
              <p className="mt-1 truncate text-xs text-muted-foreground">{o.name}</p>
              <span
                className="mt-2 flex min-h-11 items-center justify-center rounded-lg text-center sm:mt-3 text-sm font-bold text-primary-foreground"
                style={{ background: "var(--brand-gradient)" }}
              >
                Grab Now
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!loading && deals.length === 0 && (
        <EmptyState>{error ? "Could not load deals right now." : "No deals available today."}</EmptyState>
      )}
    </section>
  );
}
