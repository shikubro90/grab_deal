"use client";

import Link from "next/link";
import Image from "next/image";
import { useBrands, useOffers, SectionHeader, Skeletons, EmptyState } from "./useOffers";

export default function PopularStores() {
  const brands = useBrands();
  const offers = useOffers();
  const loading = brands.loading || offers.loading;

  const counts = {};
  offers.items.forEach((o) => {
    const k = (o.merchantName || "").trim().toLowerCase();
    if (k) counts[k] = (counts[k] || 0) + 1;
  });
  const stores = brands.items
    .map((b) => ({ ...b, count: counts[b.name.trim().toLowerCase()] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
      <SectionHeader title="Popular Stores" href="/brands" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        {loading && <Skeletons count={6} className="h-28" />}
        {stores.map((s) => (
          <Link
            key={s._id}
            href={`/offer?brand=${encodeURIComponent(s.name)}`}
            className="group min-w-0 rounded-xl border border-border bg-card p-2 text-center sm:rounded-2xl sm:p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <div className="relative mx-auto flex h-11 w-full sm:h-16 items-center justify-center">
              <Image src={s.image || "/placeholder.png"} alt={s.name || "Store"} fill sizes="160px" className="object-contain" />
            </div>
            <h3 className="mt-2 truncate text-xs font-extrabold sm:mt-3 sm:text-sm text-card-foreground">{s.name}</h3>
            <p className="mt-0.5 truncate text-[11px] font-bold text-primary sm:mt-1 sm:text-xs">{s.count} Coupons</p>
          </Link>
        ))}
      </div>
      {!loading && stores.length === 0 && <EmptyState>No stores available yet.</EmptyState>}
    </section>
  );
}
