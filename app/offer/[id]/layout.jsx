import { API_BASE_URL } from '@/lib/api'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://grabdeal.net').replace(/\/$/, '')

async function getOffer(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(id)}`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return null
    const json = await res.json()
    const d = json?.data
    return d?.product || d?.offer || (d && !Array.isArray(d) ? d : null) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const offer = await getOffer(id)
  const path = `/offer/${id}`
  if (!offer?.title) {
    return { title: 'Offer', alternates: { canonical: path } }
  }
  const description = (offer.description || `${offer.title} - coupon and deal on GrabDeal.`)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
  const images = offer.image ? [{ url: offer.image }] : undefined
  return {
    title: offer.title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', title: offer.title, description, url: path, images },
    twitter: { card: 'summary_large_image', title: offer.title, description, images: offer.image ? [offer.image] : undefined },
  }
}

export default async function OfferLayout({ children, params }) {
  const { id } = await params
  const offer = await getOffer(id)
  let jsonLd = null
  if (offer?.title) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: offer.title,
      description: offer.description || undefined,
      url: `${SITE_URL}/offer/${id}`,
      image: offer.image || undefined,
      priceValidUntil: offer.expiryDate || undefined,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: (offer.brands || offer.merchantName || 'GrabDeal').toString().trim() },
    }
  }
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      {children}
    </>
  )
}
