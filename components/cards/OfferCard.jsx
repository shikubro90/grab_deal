import Link from "next/link";
import SmartImage from "./SmartImage";

export default function OfferCard({ offer, priority = false, headingTag: H = "h3" }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-28 sm:h-48 overflow-hidden bg-muted">
        <Link href={`/offer/${offer.id}`} aria-label={`${offer.brand || offer.title} offer details`}>
        <SmartImage src={offer.image || "/placeholder.png"} alt={offer.brand || offer.title || "Offer"} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          priority={priority} className="object-cover transition duration-500 hover:scale-110" />
        </Link>
        <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 sm:right-3 sm:top-3 sm:px-3 sm:py-1 text-xs font-bold text-primary-foreground">{offer.discount}</div>
      </div>
      <div className="p-3 sm:p-5">
        <H className="truncate text-base font-black sm:text-xl">{offer.brand}</H>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-muted-foreground sm:mt-2">{offer.title}</p>
        <div className="grid md:grid-cols-2">

        <p className="mt-2 text-xs font-bold text-destructive sm:mt-4">⏱ {offer.ends}</p>
        {/* <p className="mt-2 text-xs font-bold text-destructive sm:mt-4"> ekhane update koro ekhane coutdown hobe</p> */}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 sm:mt-4 text-xs font-bold">
          <span className="text-green-700">✓ Verified</span>
          <span className={offer.online ? 'text-green-700' : 'text-orange-700'}>● {offer.online ? 'Online' : 'Offline'}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 sm:mt-5 sm:pt-4">
          <Link className="flex min-h-11 items-center px-2 text-sm font-bold text-primary" href={`/offer/${offer.id}`}>Details</Link>
          <Link className="flex min-h-11 items-center rounded-lg bg-primary px-3 text-sm sm:px-5 font-bold text-primary-foreground" href={`/offer/${offer.id}`}>View Offer</Link>
        </div>
      </div>
    </article>
  );
}