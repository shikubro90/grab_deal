'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function OfferActions({ offer }) {
  const [wishlist, setWishlist] = useState([]);
  const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('grabdeal_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  const handleShare = async () => {
    const shareUrl = window.location.href;

    const shareData = {
      title: offer?.title,
      text: `${offer?.title} - ${offer?.discount} at ${offer?.merchant || offer?.brand}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Offer link copied!');
      }
    } catch {
      /* user cancelled */
    }
  };

  const handleWishlist = () => {
    const saved = localStorage.getItem('grabdeal_wishlist');
    const oldWishlist = saved ? JSON.parse(saved) : [];

    const exists = oldWishlist.find((item) => item.id === offer.id);

    let updatedWishlist;

    if (exists) {
      updatedWishlist = oldWishlist;
    } else {
      updatedWishlist = [
        ...oldWishlist,
        {
          id: offer.id,
          title: offer.title,
          image: offer.image,
          discount: offer.discount,
          merchant: offer.merchant || offer.brand,
          url: window.location.href,
        },
      ];
    }

    localStorage.setItem('grabdeal_wishlist', JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    setShowBox(true);
  };

  return (
    <>
      <div className="flex justify-center gap-10 mt-6 text-sm text-muted-foreground">
        <button onClick={handleShare}>↗ Share</button>
        <button onClick={handleWishlist}>♡ Wishlist</button>
      </div>

      {showBox && (
        <div className="fixed right-5 top-24 z-50 w-80 rounded-3xl border border-border bg-card p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-card-foreground">
              Wishlist
            </h3>

            <button
              onClick={() => setShowBox(false)}
              className="rounded-full bg-muted px-3 py-1 font-bold text-primary"
            >
              ✕
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-2xl bg-muted p-3"
              >
                <Image
                  src={item.image}
                  alt={item.title || 'Wishlist item'}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover"
                />

                <div>
                  <p className="text-sm font-bold text-card-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-primary">
                    {item.discount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.merchant}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}