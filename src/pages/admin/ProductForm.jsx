import React, { useState } from 'react';
import { X, Eye, Maximize2, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import api from '../../api/axios';

const PRODUCT_CATEGORIES = [
    'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports & Outdoors',
    'Health & Beauty', 'Toys & Games', 'Automotive', 'Jewelry & Watches',
    'Groceries', 'Pet Supplies', 'Office Products', 'Musical Instruments', 'Handmade'
];

const ProductForm = ({ product, onSave, onCancel }) => {
  const [productData, setProductData] = useState(
    product
      ? {
          ...product,
          categories: product.categories?.[0] || PRODUCT_CATEGORIES[0],
          media: Array.isArray(product.media) ? product.media.map(m => m.url) : [],
          hotDeal: product.hotDeal || false,
        }
      : {
          name: '',
          price: 0,
          availableQuantity: 0,
          categories: PRODUCT_CATEGORIES[0],
          shortDescription: '',
          fullDescription: '',
          media: [], // Will hold File objects or existing URL strings
          hotDeal: false,
        }
  );

  const [mediaPreview, setMediaPreview] = useState(Array.isArray(product?.media) ? product.media.map(m => m.url) : []);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const previewMediaRef = React.useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'media' && files && files.length > 0) {
      const fileArray = Array.from(files);
      const previews = fileArray.map(f => URL.createObjectURL(f));
      setProductData(prev => ({ ...prev, media: [...(prev.media || []), ...fileArray] }));
      setMediaPreview(prev => ([...(prev || []), ...previews]));
    } else {
      setProductData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleRemoveMedia = (index) => {
    setProductData(prev => {
      const newMedia = Array.isArray(prev.media) ? [...prev.media] : [];
      if (index >= 0 && index < newMedia.length) newMedia.splice(index, 1);
      return { ...prev, media: newMedia };
    });
    setMediaPreview(prev => {
      const newPreviews = Array.isArray(prev) ? [...prev] : [];
      const removed = newPreviews.splice(index, 1);
      // Revoke object URL if it was created via createObjectURL
      if (removed && removed[0] && typeof removed[0] === 'string' && removed[0].startsWith && removed[0].startsWith('blob:')) {
        try { URL.revokeObjectURL(removed[0]); } catch (e) { /* ignore */ }
      }
      return newPreviews;
    });
  };

  React.useEffect(() => {
    return () => {
      // cleanup any blob URLs created for previews
      (mediaPreview || []).forEach(url => {
        if (url && typeof url === 'string' && url.startsWith && url.startsWith('blob:')) {
          try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
        }
      });
    };
  }, [mediaPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build FormData to send files + fields (server expects multipart/form-data)
    const formData = new FormData();
    formData.append('name', productData.name || '');
    formData.append('price', String(productData.price || 0));
    formData.append('availableQuantity', String(productData.availableQuantity || 0));
    formData.append('shortDescription', productData.shortDescription || '');
    formData.append('fullDescription', productData.fullDescription || '');
    formData.append('hotDeal', productData.hotDeal || false);
    // categories as JSON array
    formData.append('categories', JSON.stringify([productData.categories]));

    // Append files (File objects) to 'media'
    const mediaArray = productData.media || [];
    const files = mediaArray.filter(m => m instanceof File);
    files.forEach((f) => formData.append('media', f));

    // Include existing media URLs (if any) so server can keep them
    const existingUrls = mediaArray.filter(m => typeof m === 'string');
    if (existingUrls.length) formData.append('existingMedia', JSON.stringify(existingUrls));

    try {
      let responseData;
      if (isEditing) {
        responseData = await api.put(`/products/${product._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        responseData = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      // Pass back server response (product) to parent onSave
      onSave(responseData);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };


  const isEditing = !!product;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      
      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="categories"
          value={productData.categories}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          {PRODUCT_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Available Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity</label>
        <input
          type="number"
          name="availableQuantity"
          value={productData.availableQuantity}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          min="0"
          required
        />
      </div>

      {/* Hot Deal Checkbox */}
      <div className="md:col-span-2">
        <div className="flex items-center">
          <input
            id="hotDeal"
            name="hotDeal"
            type="checkbox"
            checked={productData.hotDeal || false}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="hotDeal" className="ml-3 block text-sm font-medium text-gray-700">
            Mark as a Hot Deal
          </label>
        </div>
      </div>

      {/* Media File Input */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Media</label>
        <input
          type="file"
          name="media"
          onChange={handleChange}
          multiple
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          accept="image/*,video/*"
        />
        {mediaPreview && mediaPreview.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Media Preview</label>
            <div className="flex gap-4 flex-wrap">
              {mediaPreview.map((src, idx) => {
                const candidate = productData.media?.[idx];
                const isVideo = (candidate && candidate.type && candidate.type.startsWith && candidate.type.startsWith('video')) || /\.(mp4|webm|ogg)$/i.test(src);
                return (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border p-1 bg-white" style={{width: 160}}>
                    {isVideo ? (
                      <video src={src} controls className="rounded-lg w-full h-32 object-cover pointer-events-none" />
                    ) : (
                      <img src={src} alt={`Preview ${idx + 1}`} className="rounded-lg w-full h-32 object-cover pointer-events-none" />
                    )}
                    <div className="absolute inset-0 flex items-start justify-end p-1 opacity-0 group-hover:opacity-100 transition pointer-events-auto">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => { setPreviewIndex(idx); setPreviewOpen(true); }}
                          className="p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow cursor-pointer"
                          aria-label={`View preview ${idx + 1}`}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="p-1 rounded-full bg-white text-red-600 hover:bg-red-50 shadow cursor-pointer"
                          aria-label={`Remove preview ${idx + 1}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {previewOpen && previewIndex !== null && (
          <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title={`Preview ${previewIndex + 1}`}>
            <div className="w-full flex items-center justify-center p-4">
              {mediaPreview[previewIndex] && (/\.(mp4|webm|ogg)$/i.test(mediaPreview[previewIndex]) ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex justify-end mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const el = previewMediaRef.current;
                        if (!el) return;
                        if (el.requestFullscreen) el.requestFullscreen();
                        else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen();
                        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
                      }}
                      className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 shadow cursor-pointer"
                      aria-label="Open fullscreen"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                  <video ref={previewMediaRef} src={mediaPreview[previewIndex]} controls className="max-w-full max-h-[70vh]" />
                </div>
              ) : (
                <img src={mediaPreview[previewIndex]} alt={`Preview ${previewIndex + 1}`} className="max-w-full max-h-[80vh] object-contain" />
              ))}
            </div>
          </Modal>
        )}
      </div>

      {/* Short Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <textarea
          name="shortDescription"
          value={productData.shortDescription}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        ></textarea>
      </div>

      {/* Full Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
        <textarea
          name="fullDescription"
          value={productData.fullDescription}
          onChange={handleChange}
          rows="6"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
      <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;