import OfferCard from "@/components/cards/OfferCard";
import Header from "@/components/layout/Header";
import { mapOffer, extractOffers } from "@/components/offer/mapOffer";
import { apiFetch } from "@/lib/api";

const norm = (v) => String(v || "").toLowerCase().trim();
const first = (v) => (Array.isArray(v) ? v[0] : v) || "";

async function getOffers({ category, brand, search }) {
  let raw = [];
  try {
    raw = extractOffers(await apiFetch("/offers", { next: { revalidate: 60 } }));
  } catch {
    return [];
  }

  return raw
    .filter((item) => {
      const matchCategory =
        !category || norm(category) === "all" || norm(item?.category) === norm(category);
      const matchBrand =
        !brand ||
        norm(item?.brands) === norm(brand) ||
        norm(item?.merchantName) === norm(brand);
      const matchSearch =
        !search ||
        [item?.title, item?.brands, item?.merchantName, item?.category, item?.description].some(
          (f) => norm(f).includes(norm(search))
        );
      return matchCategory && matchBrand && matchSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(mapOffer);
}

export default async function OffersPage({ searchParams }) {
  const params = await searchParams;
  const category = first(params?.category);
  const brand = first(params?.brand);
  const search = first(params?.search || params?.q);

  const offers = await getOffers({ category, brand, search });

  const pageTitle = search
    ? `Results for "${search}"`
    : brand
    ? `${brand} Offers`
    : category && norm(category) !== "all"
    ? `${category} Offers`
    : "All Latest Offers";

  const eyebrow = search ? "Search" : brand ? "Brand Offers" : category ? "Category Offers" : "All Offers";

  return (
    <div>
      <Header />

      <section className="min-h-screen bg-background px-3 py-6 sm:px-4 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 rounded-2xl border border-border bg-card p-4 sm:mb-8 sm:rounded-[28px] sm:p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h1 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl text-card-foreground">{pageTitle}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {offers.length} offer{offers.length === 1 ? "" : "s"} · newest first.
            </p>
          </div>

          {offers.length === 0 ? (
            <div className="rounded-3xl bg-card p-10 text-center shadow-sm">
              <h2 className="text-2xl font-black text-primary">No offers found</h2>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {offers.map((offer, i) => (
                <OfferCard key={offer.id} offer={offer} priority={i < 2} headingTag="h2" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
