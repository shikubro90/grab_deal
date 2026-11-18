import { API_BASE_URL } from "@/lib/api";

async function get(path, pick) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const list = pick(await res.json());
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function getHomeData() {
  const [offersRaw, brandsRaw, bannersRaw] = await Promise.all([
    get("/offers", (r) => r?.data?.products || r?.data || r),
    get("/brands", (r) => r?.data?.result || r?.data?.brands || r?.data || r),
    get("/banner", (r) => r?.data?.result || r?.data || r),
  ]);
  const now = Date.now();
  const offers = offersRaw
    .filter((o) => o && o.status !== false && (!o.expiryDate || new Date(o.expiryDate).getTime() >= now))
    .map((o) => ({
      _id: o._id,
      title: o.title,
      description: o.description,
      image: o.image,
      discount: Number(o.discount) || 0,
      category: o.category,
      expiryDate: o.expiryDate,
      createdAt: o.createdAt,
      brands: o.brands,
      merchantName: o.merchantName,
      offerType: o.offerType,
      verified: o.verified,
      name: o.merchantName || o.brands || o.title,
    }));
  const brands = brandsRaw.filter((b) => b.status === "active").map((b) => ({ _id: b._id, name: b.name, image: b.image }));
  const banners = bannersRaw
    .filter((b) => b.status === "active")
    .sort((a, b) => Number(a.position || 0) - Number(b.position || 0))
    .map((b) => ({ _id: b._id, image: b.image, title: b.title, subtitle: b.subtitle, discount: b.discount, offerUrl: b.offerUrl }));
  return { offers, brands, banners };
}

export async function getReviews() {
  return (await get("/reviews?status=active", (r) => r?.data?.result)).map((r) => ({
    _id: r._id, name: r.name, role: r.role, image: r.image, rating: r.rating, comment: r.comment,
  }));
}

export function endsLabel(d) {
  if (!d) return "";
  const days = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (days <= 0) return "Ends today";
  if (days === 1) return "Ends tomorrow";
  if (days <= 7) return `Ends in ${days} days`;
  return `Ends ${new Date(d).toLocaleDateString("en-GB")}`;
}
