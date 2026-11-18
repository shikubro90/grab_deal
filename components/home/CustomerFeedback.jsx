'use client';

import { useEffect, useState } from 'react';
import SmartImage from '../cards/SmartImage';

export default function CustomerFeedback({ reviews }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reviews.length <= 3) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (!reviews.length) return null;

  const visibleReviews = [
    reviews[active],
    reviews[(active + 1) % reviews.length],
    reviews[(active + 2) % reviews.length],
  ].filter(Boolean);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-primary">
          Real Users
        </p>

        <h2 className="text-3xl font-extrabold text-[#16013d]">
          Our Customers’ Feedback
        </h2>

        <p className="mx-auto mt-2 max-w-2xl text-gray-600">
          Users share how GrabDeal helps them find active discounts before
          purchasing from stores.
        </p>
      </div>

      <div className="relative">
        <div className="grid gap-5 md:grid-cols-3">
          {visibleReviews.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex items-center gap-4">
                <SmartImage
                  src={item.image || '/avatar.png'}
                  alt={item.name || 'Customer'}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-primary/10 object-cover"
                />

                <div>
                  <h3 className="font-black text-[#16013d]">
                    {item.name}
                  </h3>

                  {item.role && (
                    <p className="text-sm text-gray-600">
                      {item.role}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4 flex text-yellow-500" role="img" aria-label={`Rated ${Number(item.rating || 5)} out of 5`}>
                {Array.from({ length: Number(item.rating || 5) }).map(
                  (_, index) => (
                    <span key={index} aria-hidden="true">★</span>
                  )
                )}
              </div>

              <p className="text-sm leading-7 text-gray-600">
                “{item.comment}”
              </p>
            </div>
          ))}
        </div>

        {reviews.length > 3 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous reviews"
              className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white px-4 py-3 text-xl font-black text-primary shadow-xl lg:block"
            >
              ‹
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next reviews"
              className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white px-4 py-3 text-xl font-black text-primary shadow-xl lg:block"
            >
              ›
            </button>
          </>
        )}
      </div>

      {reviews.length > 3 && (
        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((item, index) => (
            <button
              key={item._id}
              onClick={() => setActive(index)}
              aria-label={`Show review ${index + 1}`}
              className="flex h-6 min-w-6 items-center justify-center"
            >
              <span className={index === active ? 'block h-3 w-10 rounded-full bg-primary' : 'block h-3 w-3 rounded-full bg-primary/30'} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}