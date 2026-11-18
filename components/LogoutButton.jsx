'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch {}

    try {
      localStorage.removeItem('grabdeal_user');
    } catch {}
    router.replace('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="min-h-11 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 cursor-pointer"
    >
      Logout
    </button>
  );
}