'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SmartImage from '../cards/SmartImage';

// Tab label for a banner: its title, otherwise the brand guessed from the link's domain.
function bannerLabel(b, i, merchants) {
  if (b.title?.trim()) return b.title.trim();
  try {
    const host = new URL(b.offerUrl).hostname.replace(/^www\./, '').split('.')[0];
    const known = merchants.find((m) => m && host.startsWith(m.toLowerCase().replace(/\s+/g, '')));
    if (known) return known;
    return host.charAt(0).toUpperCase() + host.slice(1);
  } catch {
    return `Offer ${i + 1}`;
  }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return reduced;
}

// Auto-advance; the first rotation waits longer so the first image stays the stable LCP element.
function useAutoRotate(count, delay, firstDelay, reduced) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    if (count <= 1 || reduced || paused) return;
    const t = setTimeout(
      () => setActive((a) => (a + 1) % count),
      active === 0 && !started.current ? firstDelay : delay
    );
    started.current = true;
    return () => clearTimeout(t);
  }, [active, count, delay, firstDelay, reduced, paused]);
  return { active, setActive, setPaused };
}

function Tabs({ items, active, onSelect, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto px-3 [scrollbar-width:none] sm:px-5">
      {items.map((name, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          onClick={() => onSelect(i)}
          className={`relative shrink-0 whitespace-nowrap px-3 pb-4 pt-3 text-sm font-semibold transition-colors sm:text-[15px] ${
            i === active ? 'text-[#3d6bd8]' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          {name}
          <span
            className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#3d6bd8] transition-opacity ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function BannerCarousel({ banners, merchants, reduced }) {
  const { active, setActive, setPaused } = useAutoRotate(banners.length, 5000, 12000, reduced);
  const labels = banners.map((b, i) => bannerLabel(b, i, merchants));

  return (
    <div
      className="flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[2.5/1] overflow-hidden rounded-[20px] bg-slate-100 shadow-md">
        {banners.map((b, i) => {
          const hasText = b.title || b.subtitle || b.discount;
          return (
            <a
              key={b._id || i}
              href={b.offerUrl || '#'}
              target={b.offerUrl?.startsWith('http') && !b.offerUrl.includes('grabdeal.net') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
                i === active ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            >
              {b.image && (
                <SmartImage
                  src={b.image}
                  alt={labels[i]}
                  fill
                  sizes="(min-width:1280px) 860px, (min-width:1024px) 66vw, 100vw"
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  loading={i === 0 ? undefined : 'lazy'}
                  quality={75}
                  className="object-cover"
                />
              )}
              {hasText && (
                <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-white/90 via-white/50 to-transparent p-5 sm:p-10">
                  {b.title && <p className="text-2xl font-black text-slate-900 sm:text-5xl">{b.title}</p>}
                  {b.discount && (
                    <span className="mt-2 w-fit rounded-md bg-[#c8373a] px-3 py-1 text-lg font-extrabold text-white sm:mt-4 sm:text-3xl">
                      {b.discount}
                    </span>
                  )}
                  {b.subtitle && <p className="mt-2 text-sm text-slate-700 sm:text-lg">{b.subtitle}</p>}
                  <span className="mt-3 w-fit rounded-lg bg-[#c8373a] px-5 py-2 text-sm font-bold text-white sm:mt-6 sm:px-8 sm:py-3 sm:text-base">
                    Grab now
                  </span>
                </div>
              )}
            </a>
          );
        })}
      </div>
      {banners.length > 1 && <Tabs items={labels} active={active} onSelect={setActive} label="Featured banners" />}
    </div>
  );
}

function OfferSpotlight({ offers, reduced }) {
  const { active, setActive, setPaused } = useAutoRotate(offers.length, 4500, 9000, reduced);
  const labels = offers.map((o) => o.merchantName || o.name || 'Offer');

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[20px] bg-slate-300 shadow-md aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:flex-1">
        {offers.map((o, i) => (
          <Link
            key={o._id}
            href={`/offer/${o._id}`}
            aria-hidden={i !== active}
            tabIndex={i === active ? 0 : -1}
            className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
              i === active ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            {o.image && (
              <SmartImage
                src={o.image}
                alt={o.title || labels[i]}
                fill
                sizes="(min-width:1024px) 340px, 100vw"
                loading="lazy"
                quality={75}
                className="object-cover"
              />
            )}
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-4 shadow-lg sm:inset-x-4 sm:bottom-4 sm:p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-900">
                Flat <span className="text-lg">{o.discount}%</span> Off
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-slate-700">
                {o.description || o.title}
              </p>
              <p className="mt-2.5 text-sm font-extrabold uppercase tracking-wider text-[#3d6bd8]">Grab now</p>
            </div>
          </Link>
        ))}
      </div>
      {offers.length > 1 && <Tabs items={labels} active={active} onSelect={setActive} label="Top offers" />}
    </div>
  );
}

export default function HeroSlider({ sliders = [], offers = [] }) {
  const reduced = useReducedMotion();

  // Spotlight: the biggest discounts that have an image, one per merchant.
  const seen = new Set();
  const spotlight = [...offers]
    .filter((o) => o.image && o.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .filter((o) => {
      const k = (o.merchantName || o.name || '').toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:px-8">
      <h1 className="sr-only">GrabDeal – best coupons, offers and deals</h1>
      {!sliders.length ? (
        <div className="aspect-[2.5/1] animate-pulse rounded-[20px] bg-primary/10" />
      ) : (
        <div className={`grid gap-5 ${spotlight.length ? 'lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]' : ''}`}>
          <BannerCarousel banners={sliders} merchants={[...new Set(offers.map((o) => o.merchantName).filter(Boolean))]} reduced={reduced} />
          {spotlight.length > 0 && <OfferSpotlight offers={spotlight} reduced={reduced} />}
        </div>
      )}
    </section>
  );
}
