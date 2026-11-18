import type { MetadataRoute } from 'next'
import { API_BASE_URL } from '@/lib/api'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://grabdeal.net').replace(/\/$/, '')

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/offer`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/brands`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ]
  try {
    const res = await fetch(`${API_BASE_URL}/offers?limit=1000`, { next: { revalidate: 3600 } })
    if (!res.ok) return entries
    const data = await res.json()
    const d = data?.data
    const list = d?.products || d?.result || (Array.isArray(d) ? d : Array.isArray(data) ? data : [])
    if (Array.isArray(list)) {
      for (const o of list) {
        if (!o?._id) continue
        entries.push({
          url: `${SITE_URL}/offer/${o._id}`,
          lastModified: o.updatedAt ? new Date(o.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch {
    // fall back to static entries
  }
  return entries
}
