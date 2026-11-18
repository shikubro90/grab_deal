import OfferCard from "@/components/cards/OfferCard";
import Header from "@/components/layout/Header";
import Link from "next/link";
import Image from "next/image";
import OfferActions from "@/components/offer/OfferActions";
import OfferDealCard from "@/components/offer/OfferDealCard";
import { mapOffer, extractOffers, safeUrl } from "@/components/offer/mapOffer";
import { apiFetch } from "@/lib/api";

async function getOfferById(id) {
  try {
    const data = await apiFetch(`/offers/${id}`, { next: { revalidate: 60 } });
    const raw = data?.data || data;
    if (!raw?._id) return null;
    const offer = mapOffer(raw);
    offer.shopLink = safeUrl(offer.shopLink);
    return offer;
  } catch {
    return null;
  }
}

async function getRelatedOffers(currentId, category) {
  try {
    const data = await apiFetch("/offers", { next: { revalidate: 60 } });
    const all = extractOffers(data).filter((i) => i._id !== currentId);
    const same = all.filter((i) => category && i.category === category);
    const rest = all.filter((i) => !same.includes(i));
    return [...same, ...rest].slice(0, 4).map(mapOffer);
  } catch {
    return [];
  }
}

export default async function Page({ params }) {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer) {
    return (
      <div>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="rounded-3xl bg-card p-10 text-center shadow-sm">
            <h1 className="text-3xl font-black text-primary">Offer Not Found</h1>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const related = await getRelatedOffers(id, offer.category);
  let host = "";
  try {
    host = offer.shopLink ? new URL(offer.shopLink).hostname.replace(/^www\./, "") : "";
  } catch {}

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link> ›{" "}
            <Link href="/offer" className="hover:text-primary">Offers</Link>
            {offer.category && (
              <>
                {" "}› <Link href={`/offer?category=${encodeURIComponent(offer.category)}`} className="hover:text-primary">{offer.category}</Link>
              </>
            )}{" "}
            › <span className="text-card-foreground">{offer.title}</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div
                className="inline-block rounded-full px-4 py-2 text-sm font-bold text-primary-foreground"
                style={{ backgroundImage: "var(--brand-gradient)" }}
              >
                {offer.discount}
              </div>

              <div className="relative mt-5 flex h-[350px] items-center justify-center overflow-hidden rounded-2xl bg-muted p-6">
                <Image src={offer.image} alt={offer.title || "Offer"} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-contain" />
              </div>

              <OfferActions offer={offer} />

              <div className="mt-8">
                <h2 className="text-xl font-black text-card-foreground">About This Offer</h2>
                <p className="mt-3 text-muted-foreground">
                  {offer.description || "No description available for this offer."}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <OfferDealCard offer={offer} />

              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-black text-card-foreground">Offer Information</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Merchant</dt>
                    <dd className="font-bold">{offer.merchant}</dd>
                  </div>
                  {offer.category && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-bold">{offer.category}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Valid On</dt>
                    <dd className="font-bold">{offer.applicableOn}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Expires</dt>
                    <dd className="font-bold text-destructive">{offer.ends}</dd>
                  </div>
                  {offer.shopLink && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Official Website</dt>
                      <dd className="font-bold">
                        <a
                          href={offer.shopLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          {host || "Visit site"}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-black">More Offers You Might Like</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <OfferCard key={item.id} offer={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
