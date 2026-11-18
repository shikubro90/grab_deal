'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { adminFetch } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

export default function EditReviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    rating: 5,
    comment: '',
    status: 'active',
  });

  useEffect(() => {
    if (id) fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      setLoading(true);

      const res = await adminFetch(`/reviews/${id}`);
      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data?.message || 'Review load failed', 'error');
        setLoading(false);
        return;
      }

      const review = data?.data?.result || data?.data || data;

      setFormData({
        name: review?.name || '',
        role: review?.role || '',
        image: review?.image || '',
        rating: review?.rating || 5,
        comment: review?.comment || '',
        status: review?.status || 'active',
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire('Server Error', 'Review load failed', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire('Invalid File', 'Please upload PNG, JPG or WEBP image', 'error');
      e.target.value = '';
      return;
    }

    const maxSize = 900 * 1024;

    if (file.size > maxSize) {
      Swal.fire('Image Too Large', 'Maximum image size is 900 KB', 'warning');
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);

      const result = await uploadToCloudinary(file);

      if (!result.success) {
        setUploading(false);
        Swal.fire('Upload Failed', result.message || 'Something went wrong', 'error');
        return;
      }

      setFormData({
        ...formData,
        image: result.url,
      });

      setUploading(false);

      Swal.fire({
        icon: 'success',
        title: 'Uploaded',
        text: 'Image uploaded successfully',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      setUploading(false);
      Swal.fire('Upload Error', 'Image upload failed', 'error');
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      role: formData.role,
      image: formData.image,
      rating: Number(formData.rating),
      comment: formData.comment,
      status: formData.status,
    };

    try {
      setSubmitting(true);

      const res = await adminFetch(`/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        Swal.fire('Update Failed', data?.message || 'Review update failed', 'error');
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Review updated successfully',
        timer: 1200,
        showConfirmButton: false,
      });

      setSubmitting(false);
      router.push('/dashboard/reviews');
    } catch (error) {
      setSubmitting(false);
      Swal.fire('Server Error', 'Something went wrong', 'error');
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-4 sm:p-8 shadow-sm">
        <p className="font-bold text-primary">Loading review...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground sm:text-4xl">
          Edit Review
        </h1>
        <p className="mt-2 text-gray-500">
          Update customer feedback for homepage section.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">
              Customer Name
            </label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Rashed Ahmed"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Role
            </label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Regular Shopper"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Rating
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">
              Customer Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />

            {uploading && (
              <p className="mt-2 text-sm font-bold text-primary">
                Uploading...
              </p>
            )}

            {formData.image && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-20 w-20 rounded-full border object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="min-h-11 inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">
              Comment
            </label>

            <textarea
              name="comment"
              required
              rows="5"
              maxLength="500"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Write customer feedback..."
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />

            <p className="mt-1 text-xs text-gray-500">
              {formData.comment.length}/500 characters
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={uploading || submitting}
            className="min-h-11 inline-flex items-center justify-center min-h-11 rounded-xl bg-primary px-8 py-3 font-bold text-white disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Review'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard/reviews')}
            className="min-h-11 inline-flex items-center justify-center min-h-11 rounded-xl border border-primary/20 px-8 py-3 font-bold text-primary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}