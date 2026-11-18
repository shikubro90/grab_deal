"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useOffers, endsLabel, SectionHeader, Skeletons, EmptyState } from "./useOffers";

export default function TopCoupons() {
  const { items, loading, error } = useOffers();
  const [tab, setTab] = useState("All");

  const cats = ["All", ...Array.from(new Set(items.map((o) => o.category).filter(Boolean)))];
  const rows = items
    .filter((o) => tab === "All" || o.category === tab)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:pb-12 lg:px-8">
      <SectionHeader title="Today's Top Coupons & Offers" href="/offer" />

      <div className="mb-4 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
              tab === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <Skeletons count={4} className="h-24" />}
        {rows.map((o) => (
          <Link
            key={o._id}
            href={`/offer/${o._id}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 sm:gap-4 sm:rounded-2xl sm:p-4 shadow-sm transition hover:shadow-lg"
          >
            <div className="relative flex h-12 w-12 shrink-0 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
              <Image src={o.image} alt={o.name || "Coupon"} fill sizes="64px" className="object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-extrabold sm:text-base text-card-foreground">
                {o.discount ? `${o.discount}% OFF` : "Special Offer"} · {o.name}
              </h3>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{o.description || o.title}</p>
              <p className="mt-1 text-xs font-bold text-destructive">{endsLabel(o.expiryDate)}</p>
            </div>
            <span
              className="flex min-h-11 shrink-0 items-center rounded-lg px-3 text-xs sm:px-4 sm:text-sm font-bold text-primary-foreground"
              style={{ background: "var(--brand-gradient)" }}
            >
              View All
            </span>
          </Link>
        ))}
      </div>
      {!loading && rows.length === 0 && (
        <EmptyState>{error ? "Could not load offers right now." : "No offers in this category yet."}</EmptyState>
      )}
    </section>
  );
}
