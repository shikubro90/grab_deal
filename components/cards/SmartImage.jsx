'use client';

import Image from 'next/image';

// Cloudinary URLs get f_auto,q_auto + width transforms straight from the CDN;
// everything else goes through the regular Next.js image optimizer.
export function smartLoader({ src, width, quality }) {
  if (src.includes('res.cloudinary.com') && src.includes('/upload/') && !/\/upload\/[^/]*(f_auto|w_\d)/.test(src)) {
    return src.replace('/upload/', `/upload/f_auto,q_${quality || 'auto'},c_limit,w_${width}/`);
  }
  if (src.startsWith('/') || !src.includes('res.cloudinary.com')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  }
  return src;
}

export default function SmartImage(props) {
  return <Image loader={smartLoader} {...props} />;
}
