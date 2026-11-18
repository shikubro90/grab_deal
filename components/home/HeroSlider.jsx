'use client';

import { useEffect, useRef, useState } from 'react';
import SmartImage from '../cards/SmartImage';

export default function HeroSlider({ sliders }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const [reduced, setReduced] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (sliders.length <= 1 || reduced) return;
    // First rotation waits longer so the initial hero image stays the stable LCP element.
    const timer = setTimeout(
      () => changeSlide((activeSlide + 1) % sliders.length),
      activeSlide === 0 && !started.current ? 12000 : 5000
    );
    started.current = true;
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide, sliders.length, reduced]);

  const changeSlide = (index) => {
    setFade(false);

    setTimeout(() => {
      setActiveSlide(index);
      setFade(true);
    }, 250);
  };

 if (!sliders.length) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:px-8">
      <div className="h-[260px] animate-pulse rounded-[24px] bg-primary/10 shadow-2xl sm:h-[340px] md:h-[430px] lg:h-[500px]" />
    </section>
  );
}

  const currentSlide = sliders[activeSlide];

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:px-8">
      <div className="relative h-[260px] overflow-hidden rounded-[24px] bg-primary shadow-2xl sm:h-[340px] md:h-[430px] lg:h-[500px] lg:rounded-[32px]">
        {currentSlide.image && (
          <SmartImage
            src={currentSlide.image}
            alt={currentSlide.title || 'Slider image'}
            fill
            sizes="(min-width:1280px) 1216px, 100vw"
            priority={activeSlide === 0}
            fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
            quality={50}
            className={`object-cover transition-all duration-500 motion-reduce:transition-none ease-in-out ${
              fade ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#12002f]/90 via-[#7b00ff]/55 to-transparent" />

        <div
          className={`relative z-10 flex h-full max-w-2xl flex-col justify-center p-5 text-white transition-all duration-500 motion-reduce:transition-none ease-in-out sm:p-8 md:p-12 lg:p-16 ${
            fade ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {currentSlide.discount && (
            <span className="mb-3 w-fit rounded-full bg-white/20 px-4 py-2 text-xs font-extrabold backdrop-blur-md sm:mb-5 sm:text-sm">
              {currentSlide.discount}
            </span>
          )}

          {currentSlide.title && (
            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-6xl lg:text-7xl">
              {currentSlide.title}
            </h1>
          )}

          {currentSlide.subtitle && (
            <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base md:mt-5 md:text-xl">
              {currentSlide.subtitle}
            </p>
          )}

          <a
            href={currentSlide.offerUrl || '#'}
            className="mt-5 flex min-h-11 w-fit items-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-xl transition hover:scale-105 sm:mt-8 sm:px-7 sm:py-4 sm:text-base"
          >
            Explore Offers →
          </a>
        </div>

        {sliders.length > 1 && (
          <>
            <button
              onClick={() =>
                changeSlide((activeSlide - 1 + sliders.length) % sliders.length)
              }
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-black text-primary shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5"
            >
              ‹
            </button>

            <button
              onClick={() => changeSlide((activeSlide + 1) % sliders.length)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-black text-primary shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5"
            >
              ›
            </button>

            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-1 sm:bottom-8">
              {sliders.map((slide, index) => (
                <button
                  key={slide._id || index}
                  onClick={() => changeSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeSlide}
                  className="flex h-6 min-w-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-white"
                >
                  <span
                    className={
                      index === activeSlide
                        ? 'block h-2.5 w-8 rounded-full bg-white transition-all'
                        : 'block h-2.5 w-2.5 rounded-full bg-white/60 transition-all'
                    }
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}