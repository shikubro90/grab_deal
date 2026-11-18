'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogoutButton from '../LogoutButton';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const menus = [
    {
      group: 'Overview',
      items: [{ icon: '🏠', name: 'Dashboard', link: '/dashboard' }],
    },
    {
      group: 'Banner',
      items: [
        { name: 'All Banners', link: '/dashboard/banner', icon: '🖼' },
        { name: 'Add Banner', link: '/dashboard/banner/add', icon: '➕' },
      ],
    },
    {
      group: 'Offers',
      items: [
        { name: 'All Offers', link: '/dashboard/offers/view', icon: '🔥' },
        { name: 'Add Offer', link: '/dashboard/offers', icon: '➕' },
      ],
    },
    {
      group: 'Categories',
      items: [
        { name: 'All Categories', link: '/dashboard/category/view', icon: '📋' },
        { name: 'Add Category', link: '/dashboard/category', icon: '➕' },
      ],
    },
    {
      group: 'Brands',
      items: [
        { name: 'All Brands', link: '/dashboard/brands/view', icon: '🏷️' },
        { name: 'Add Brand', link: '/dashboard/brands', icon: '➕' },
      ],
    },
    {
      group: 'Customers',
      items: [{ name: 'Reviews', link: '/dashboard/reviews', icon: '⭐' }],
    },
  ];

  const renderContent = (isMobile) => {
    const c = isMobile ? false : collapsed;
    return (
    <div
      className={`h-full min-h-screen overflow-y-auto bg-foreground text-white transition-all duration-300 ${
        isMobile ? 'w-72 max-w-[85vw] p-5' : c ? 'w-20 p-4' : 'w-64 p-6'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" target="_blank">
          {!c ? (
            <Image alt="Logo" width={160} height={80} src="/footer.png" />
          ) : (
            <div className="text-2xl font-black">G</div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden min-h-11 min-w-11 rounded-lg bg-primary px-2 py-1 text-sm lg:block"
        >
          {c ? '→' : '←'}
        </button>
      </div>

      <div className="space-y-6">
        {menus.map((section) => (
          <div key={section.group}>
            {!c && (
              <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-white/60">
                {section.group}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((menu) => {
                const active =
                  pathname === menu.link || (menu.link !== "/dashboard" && pathname.startsWith(menu.link + "/"));

                return (
                  <Link
                    key={menu.link}
                    href={menu.link}
                    onClick={() => setMobileOpen(false)}
                    title={menu.name}
                    className={`flex items-center gap-3 min-h-11 rounded-xl px-4 py-3 transition ${
                      active ? 'bg-primary' : 'hover:bg-primary'
                    } ${c ? 'justify-center px-2' : ''}`}
                  >
                    <span className="text-xl">{menu.icon}</span>
                    {!c && <span>{menu.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className={c ? 'flex justify-center' : ''}>
          <LogoutButton />
        </div>
      </div>
    </div>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 bg-foreground px-3 text-white shadow-md lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-xl"
        >
          ☰
        </button>
        <Link href="/dashboard" className="flex min-h-11 items-center text-lg font-black">
          GrabDeal Admin
        </Link>
      </header>

      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">
        {renderContent(false)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
          <div
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative z-10 h-full w-fit">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-2 top-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-foreground"
            >
              ✕
            </button>
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
