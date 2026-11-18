'use client';

import { useEffect, useState } from 'react';

function remaining(expiry) {
  if (!expiry) return null;
  const ms = new Date(expiry).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  if (ms <= 0) return { expired: true };
  const s = Math.floor(ms / 1000);
  return {
    expired: false,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function OfferDealCard({ offer }) {
  const [left, setLeft] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    setLeft(remaining(offer.expiryDate));
    const t = setInterval(() => setLeft(remaining(offer.expiryDate)), 1000);
    return () => clearInterval(t);
  }, [offer.expiryDate]);

  const hasCode = !!offer.couponCode;
  const expired = left?.expired;

  const handleClick = async () => {
    if (hasCode) {
      setRevealed(true);
      try {
        await navigator.clipboard.writeText(offer.couponCode);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
    if (offer.shopLink) {
      window.open(offer.shopLink, '_blank', 'noopener,noreferrer');
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-muted-foreground">{offer.brand}</span>
        {offer.verified && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-primary">
            ✓ Verified
          </span>
        )}
      </div>

      <p
        className="mt-4 bg-clip-text break-words text-4xl font-black sm:text-5xl text-transparent"
        style={{ backgroundImage: 'var(--brand-gradient)' }}
      >
        {offer.discount}
      </p>
      <h2 className="mt-2 text-lg font-bold text-card-foreground">{offer.title}</h2>

      <p className="mt-4 text-sm font-semibold text-muted-foreground">
        Valid Till: <span className="text-card-foreground">{offer.ends}</span>
      </p>

      {left && (
        <div className="mt-3 text-sm font-bold" aria-live="off">
          {left.expired ? (
            <span className="text-destructive">This offer has expired</span>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {[
                ['d', 'Days'],
                ['h', 'Hrs'],
                ['m', 'Min'],
                ['s', 'Sec'],
              ].map(([k, label]) => (
                <div key={k} className="min-w-0 rounded-xl bg-muted px-2 py-2 text-center">
                  <div className="text-lg font-black text-primary">{pad(left[k])}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {revealed && hasCode && (
        <div className="mt-4 rounded-xl border-2 border-dashed border-primary bg-muted px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            {copied ? 'Code copied to clipboard' : 'Your code'}
          </p>
          <p className="break-all text-xl font-black tracking-widest text-primary">{offer.couponCode}</p>
        </div>
      )}

      {offer.shopLink ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={expired}
          className="mt-5 min-h-12 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasCode ? (revealed ? 'Open Official Site' : 'Show Code') : 'Get Deal'}
        </button>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Official link not available.</p>
      )}

      <button
        type="button"
        onClick={() => setShowTerms((v) => !v)}
        aria-expanded={showTerms}
        className="mt-4 min-h-11 text-sm font-bold text-primary"
      >
        {showTerms ? 'Hide Details ▲' : 'Show Details ▼'}
      </button>
      {showTerms && (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {offer.terms.length > 0 ? (
            offer.terms.map((t, i) => <li key={i}>{t}</li>)
          ) : (
            <li>No terms and conditions available.</li>
          )}
        </ul>
      )}
    </div>
  );
}
