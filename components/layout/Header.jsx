'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Gem, Menu, Search, Shirt, Footprints, Watch, X } from 'lucide-react';

const NAV_ITEMS = [
  { title: 'Clothing', icon: Shirt },
  { title: 'Footwear', icon: Footprints },
  { title: 'Watches', icon: Watch },
  { title: 'Accessories', icon: Gem },
];

const categoryHref = (title) => `/offer?category=${encodeURIComponent(title)}`;

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setMenuOpen(false);
    router.push(`/offer?search=${encodeURIComponent(q)}`);
  };

  const SearchForm = ({ className = '' }) => (
    <form onSubmit={onSearch} role="search" className={className}>
      <div className="flex w-full items-center overflow-hidden rounded-full border border-border bg-muted focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search deals, stores & offers"
          aria-label="Search offers"
          className="min-w-0 w-full bg-transparent px-4 py-2.5 text-base md:text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Search"
          className="m-1 flex h-9 w-10 shrink-0 items-center justify-center rounded-full text-primary-foreground"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-14 items-center gap-3 sm:h-16 sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Home">
            <Image src="/logo.png" width={140} height={56} alt="GrabDeal" priority className="h-10 w-auto sm:h-auto" />
          </Link>

          {SearchForm({ className: 'hidden flex-1 md:block md:max-w-xl lg:mx-auto' })}

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {SearchForm({ className: 'pb-2 md:hidden' })}

        <nav className="hidden items-center gap-1 pb-2 md:flex">
          {NAV_ITEMS.map(({ title, icon: Icon }) => (
            <Link
              key={title}
              href={categoryHref(title)}
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted hover:text-primary"
            >
              <Icon className="h-4 w-4 text-primary" />
              {title}
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col gap-4 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <Image src="/logo.png" width={110} height={44} alt="GrabDeal" />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {SearchForm({})}

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ title, icon: Icon }) => (
                <Link
                  key={title}
                  href={categoryHref(title)}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 min-h-11 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted hover:text-primary"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  {title}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
