'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { adminFetch } from '@/lib/api';
import { uploadToCloudinary } from '../../../../../lib/uploadToCloudinary';

export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    subtitle: '',
    discount: '',
    position: 0,
    offerUrl: '',
    status: 'active',
  });

  useEffect(() => {
    if (id) fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      setLoading(true);

      const res = await adminFetch(`/banner/${id}`);
      const data = await res.json();

      if (!res.ok) {
        Swal.fire('Error', data?.message || 'Banner load failed', 'error');
        setLoading(false);
        return;
      }

      const banner = data?.data?.result || data?.data || data;

      setFormData({
        image: banner?.image || '',
        title: banner?.title || '',
        subtitle: banner?.subtitle || '',
        discount: banner?.discount || '',
        position: banner?.position ?? 0,
        offerUrl: banner?.offerUrl || '',
        status: banner?.status || 'active',
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire('Server Error', 'Banner load failed', 'error');
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
              Swal.fire('Upload Failed', data?.message || 'Something went wrong', 'error');
              return;
            }
      
            setFormData({
              ...formData,
              image: result?.url,
            });
      
            setUploading(false);
      
            Swal.fire({
              icon: 'success',
              title: 'Uploaded',
              text: 'Image uploaded successfully',
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (error) {
            setUploading(false);
            Swal.fire('Upload Error', 'Server upload failed', 'error');
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
      image: formData.image || '',
      title: formData.title,
      subtitle: formData.subtitle,
      discount: formData.discount,
      position: Number(formData.position),
      offerUrl: formData.offerUrl,
      status: formData.status,
    };

    try {
      setSubmitting(true);

      const res = await adminFetch(`/banner/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        Swal.fire('Update Failed', data?.message || 'Banner update failed', 'error');
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Banner updated successfully',
        timer: 1500,
        showConfirmButton: false,
      });

      setSubmitting(false);
      router.push('/dashboard/banner');
    } catch (error) {
      setSubmitting(false);
      Swal.fire('Server Error', 'Something went wrong', 'error');
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-4 sm:p-8 shadow-sm">
        <p className="font-bold text-primary">Loading banner...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground sm:text-4xl">
          Edit Banner
        </h1>
        <p className="mt-2 text-gray-500">
          Update homepage hero slider banner.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">
              Banner Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />

            <p className="mt-2 text-xs text-gray-500">
              Image optional. PNG, JPG, WEBP supported. Max 900 KB.
            </p>

            {uploading && (
              <p className="mt-2 text-sm font-bold text-primary">
                Uploading...
              </p>
            )}

            {formData.image && (
              <div className="mt-4">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-64 w-full rounded-2xl border object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Fashion Mega Sale"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              Discount Text
            </label>
            <input
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Up to 70% OFF"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Position</label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="1"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Offer URL</label>
            <input
              type="text"
              name="offerUrl"
              value={formData.offerUrl}
              onChange={handleChange}
              placeholder="/offers"
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">Subtitle</label>
            <textarea
              name="subtitle"
              rows="4"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Find latest clothing, footwear and accessories offers from top stores."
              className="min-h-11 w-full rounded-xl border border-primary/10 px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Status</label>
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
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={uploading || submitting}
            className="min-h-11 inline-flex items-center justify-center min-h-11 rounded-xl bg-primary px-8 py-3 font-bold text-white disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Banner'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard/banner')}
            className="min-h-11 inline-flex items-center justify-center min-h-11 rounded-xl border border-primary/20 px-8 py-3 font-bold text-primary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}