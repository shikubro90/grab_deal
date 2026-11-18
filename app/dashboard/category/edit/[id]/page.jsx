'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { adminFetch } from '@/lib/api';

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    imageURLs: '',
    status: 'active',
  });

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const res = await adminFetch(`/categories/${id}`);
      const data = await res.json();

      const category = data?.data?.result || data?.data || data;

      setFormData({
        title: category?.title || '',
        imageURLs: Array.isArray(category?.imageURLs)
          ? category.imageURLs.join('\n')
          : '',
        status: category?.status || 'active',
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Category load failed',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageURLs = formData.imageURLs
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean) || " ";

    const payload = {
      title: formData.title,
      imageURLs,
      status: formData.status,
    };

    try {
      setSubmitting(true);

      const res = await adminFetch(`/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);

        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: data?.message || 'Category update failed',
        });

        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Category updated successfully',
        timer: 1500,
        showConfirmButton: false,
      });

      setSubmitting(false);

     
    } catch (error) {
      setSubmitting(false);

      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong',
      });
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-4 sm:p-8 shadow-sm">
        <p className="font-bold text-primary">Loading category...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground sm:text-4xl">
          Edit Category
        </h1>
        <p className="mt-2 text-gray-500">
          Update category title, images and status.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">
              Category Title
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Electronics"
              required
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base outline-none focus:border-primary/80"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base outline-none focus:border-primary/80"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">
              Image URLs
            </label>

            <textarea
              name="imageURLs"
              rows="5"
              value={formData.imageURLs}
              onChange={handleChange}
              placeholder="https://example.com/image-1.jpg"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base outline-none focus:border-primary/80"
            />

            <p className="mt-2 text-xs text-gray-500">
              Multiple image URL দিতে চাইলে প্রতি লাইনে একটি করে URL দিন।
            </p>
          </div>
        </div>

        {formData.imageURLs && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {formData.imageURLs
              .split('\n')
              .map((url) => url.trim())
              .filter(Boolean)
              .map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Category preview"
                  className="h-32 w-full rounded-xl border object-cover"
                />
              ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 inline-flex items-center justify-center min-h-11 rounded-xl bg-primary px-8 py-3 font-bold text-white disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Category'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard/categories')}
            className="min-h-11 inline-flex items-center justify-center min-h-11 rounded-xl border border-primary/20 px-8 py-3 font-bold text-primary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}