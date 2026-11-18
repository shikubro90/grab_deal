// Normalises a raw API offer into the shape used by the offer pages and OfferCard.
export function mapOffer(item) {
  const brand = (item?.brands || "").trim() || item?.merchantName || item?.title || "";
  return {
    id: item?._id,
    title: item?.title,
    brand,
    image: item?.image,
    discount: item?.discount != null ? `${item.discount}% OFF` : "",
    ends: item?.expiryDate
      ? new Date(item.expiryDate).toLocaleDateString("en-GB")
      : "N/A",
    expiryDate: item?.expiryDate || null,
    online: item?.offerType === "online",
    verified: !!item?.verified,
    category: item?.category,
    merchant: item?.merchantName || brand,
    applicableOn: item?.offerType === "online" ? "Website & App" : "Store",
    description: item?.description,
    shopLink: item?.shopLink,
    couponCode: (item?.couponCode || "").trim(),
    terms: item?.termsAndCondition
      ? item.termsAndCondition.split("\n").map((t) => t.trim()).filter(Boolean)
      : [],
    createdAt: item?.createdAt,
  };
}

export function extractOffers(data) {
  const d = data?.data;
  const list = d?.products || d?.result || (Array.isArray(d) ? d : null) || (Array.isArray(data) ? data : []);
  return Array.isArray(list) ? list : [];
}

export function safeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}
