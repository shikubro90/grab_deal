'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Same-origin route: it calls the backend and sets the token as an
      // HttpOnly cookie, so the token is never readable from JavaScript.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoading(false);
        Swal.fire('Login Failed', data?.message || 'Invalid credentials', 'error');
        return;
      }

      try {
        if (data?.user) localStorage.setItem('grabdeal_user', JSON.stringify(data.user));
      } catch {}

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Successfully logged in',
        timer: 1200,
        showConfirmButton: false,
      });
      setLoading(false);
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      setLoading(false);
      Swal.fire('Server Error', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-primary/10 bg-white p-5 shadow-xl sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-foreground sm:text-4xl">GrabDeal</h1>
          <p className="mt-2 text-gray-500">Admin Dashboard Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@grabdeal.com"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base outline-none focus:border-primary"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="min-h-11 w-full rounded-xl bg-primary py-3 font-bold text-white hover:bg-primary disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}