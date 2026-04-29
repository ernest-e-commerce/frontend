import React, { useState } from "react";
import { X, Eye, Maximize2, Loader2 } from "lucide-react";
import Modal from "../../components/Modal";
import { useCart } from "../../context/CartContext";
import { createProduct, updateProduct } from "../../api/productService";
import { toast } from "sonner";

const ProductForm = ({ product, onSave }) => {
  const { categories: PRODUCT_CATEGORIES } = useCart();

  const isEditing = !!product;

  // existingMedia holds rows from product_media (id + url) the admin chose to keep.
  // newFiles holds File objects from <input type="file">.
  const [existingMedia, setExistingMedia] = useState(
    product?.media ? product.media.map((m) => ({ id: m._id, url: m.url })) : []
  );
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [productData, setProductData] = useState(
    product
      ? {
          name: product.name,
          price: product.price,
          availableQuantity: product.availableQuantity,
          shortDescription: product.shortDescription || "",
          fullDescription: product.fullDescription || "",
          hotDeal: product.hotDeal || false,
          categories: product.categories?.[0] || (PRODUCT_CATEGORIES[0]?.name || ""),
        }
      : {
          name: "",
          price: 0,
          availableQuantity: 0,
          shortDescription: "",
          fullDescription: "",
          hotDeal: false,
          categories: PRODUCT_CATEGORIES[0]?.name || "",
        }
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSource, setPreviewSource] = useState(null);
  const previewMediaRef = React.useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "media" && files && files.length > 0) {
      const arr = Array.from(files);
      const previews = arr.map((f) => URL.createObjectURL(f));
      setNewFiles((prev) => [...prev, ...arr]);
      setNewPreviews((prev) => [...prev, ...previews]);
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const removeExistingMedia = (idx) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx) => {
    setNewPreviews((prev) => {
      const url = prev[idx];
      if (url?.startsWith("blob:")) {
        try { URL.revokeObjectURL(url); } catch (_e) { void 0; }
      }
      return prev.filter((_, i) => i !== idx);
    });
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  React.useEffect(() => {
    return () => {
      newPreviews.forEach((u) => {
        if (u?.startsWith("blob:")) {
          try { URL.revokeObjectURL(u); } catch (_e) { void 0; }
        }
      });
    };
  }, [newPreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: productData.name,
      price: Number(productData.price),
      availableQuantity: Number(productData.availableQuantity),
      shortDescription: productData.shortDescription,
      fullDescription: productData.fullDescription,
      hotDeal: productData.hotDeal,
      categories: [productData.categories],
      files: newFiles,
    };

    try {
      const saved = isEditing
        ? await updateProduct(product._id, {
            ...payload,
            keepMediaIds: existingMedia.map((m) => m.id),
          })
        : await createProduct(payload);

      toast.success(isEditing ? "Product updated" : "Product created");
      onSave(saved);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPreview = (src) => {
    setPreviewSource(src);
    setPreviewOpen(true);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="categories"
          value={productData.categories}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

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

        {(existingMedia.length > 0 || newPreviews.length > 0) && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Media Preview</label>
            <div className="flex gap-4 flex-wrap">
              {existingMedia.map((m, idx) => {
                const isVideo = /\.(mp4|webm|ogg)$/i.test(m.url);
                return (
                  <div key={`exist-${m.id}`} className="relative group rounded-lg overflow-hidden border p-1 bg-white" style={{ width: 160 }}>
                    {isVideo ? (
                      <video src={m.url} controls className="rounded-lg w-full h-32 object-cover pointer-events-none" />
                    ) : (
                      <img src={m.url} alt={`Media ${idx + 1}`} className="rounded-lg w-full h-32 object-cover pointer-events-none" />
                    )}
                    <div className="absolute inset-0 flex items-start justify-end p-1 opacity-0 group-hover:opacity-100 transition pointer-events-auto">
                      <div className="flex gap-1">
                        <button type="button" onClick={() => openPreview(m.url)} className="p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow cursor-pointer" aria-label="Preview">
                          <Eye size={14} />
                        </button>
                        <button type="button" onClick={() => removeExistingMedia(idx)} className="p-1 rounded-full bg-white text-red-600 hover:bg-red-50 shadow cursor-pointer" aria-label="Remove">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {newPreviews.map((src, idx) => {
                const file = newFiles[idx];
                const isVideo = (file?.type || "").startsWith("video") || /\.(mp4|webm|ogg)$/i.test(src);
                return (
                  <div key={`new-${idx}`} className="relative group rounded-lg overflow-hidden border p-1 bg-white" style={{ width: 160 }}>
                    {isVideo ? (
                      <video src={src} controls className="rounded-lg w-full h-32 object-cover pointer-events-none" />
                    ) : (
                      <img src={src} alt={`New ${idx + 1}`} className="rounded-lg w-full h-32 object-cover pointer-events-none" />
                    )}
                    <div className="absolute inset-0 flex items-start justify-end p-1 opacity-0 group-hover:opacity-100 transition pointer-events-auto">
                      <div className="flex gap-1">
                        <button type="button" onClick={() => openPreview(src)} className="p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow cursor-pointer" aria-label="Preview">
                          <Eye size={14} />
                        </button>
                        <button type="button" onClick={() => removeNewFile(idx)} className="p-1 rounded-full bg-white text-red-600 hover:bg-red-50 shadow cursor-pointer" aria-label="Remove">
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

        {previewOpen && previewSource && (
          <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview">
            <div className="w-full flex items-center justify-center p-4">
              {/\.(mp4|webm|ogg)$/i.test(previewSource) ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex justify-end mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const el = previewMediaRef.current;
                        if (!el) return;
                        if (el.requestFullscreen) el.requestFullscreen();
                        else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen();
                      }}
                      className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 shadow cursor-pointer"
                      aria-label="Open fullscreen"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                  <video ref={previewMediaRef} src={previewSource} controls className="max-w-full max-h-[70vh]" />
                </div>
              ) : (
                <img src={previewSource} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
              )}
            </div>
          </Modal>
        )}
      </div>

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
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
