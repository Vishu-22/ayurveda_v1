"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GalleryImage } from "@/types";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { getAdminHeaders } from "@/lib/admin-auth";

const gallerySchema = z.object({
  image_url: z.string().url("Please enter a valid image URL"),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  display_order: z.number().int().min(0).optional(),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

interface GalleryFormProps {
  image?: GalleryImage;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GalleryForm({ image, onSuccess, onCancel }: GalleryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("file");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    mode: "onChange",
    defaultValues: image
      ? {
          image_url: image.image_url,
          title: image.title || "",
          description: image.description || "",
          category: image.category || "",
          display_order: image.display_order || 0,
        }
      : {
          display_order: 0,
        },
  });

  const imageUrl = watch("image_url");

  useEffect(() => {
    if (image) {
      reset({
        image_url: image.image_url,
        title: image.title || "",
        description: image.description || "",
        category: image.category || "",
        display_order: image.display_order || 0,
      });
    }
  }, [image, reset]);

  const handleFileUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const headers = getAdminHeaders();
      // Remove Content-Type header to let browser set it with boundary
      delete (headers as any)["Content-Type"];

      const response = await fetch("/api/upload/image", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      setValue("image_url", data.url);
      setSubmitStatus(null);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setSubmitStatus("error");
      alert(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: GalleryFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const headers = getAdminHeaders();
      const url = image ? `/api/admin/gallery/${image.id}` : "/api/admin/gallery";
      const method = image ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save gallery image");
      }

      setSubmitStatus("success");
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error saving gallery image:", error);
      setSubmitStatus("error");
      alert(error.message || "Failed to save gallery image");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Image <span className="text-red-500">*</span>
        </label>

        {/* Upload Mode Toggle */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === "file"
                ? "bg-ayurveda-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Upload size={16} className="inline mr-2" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadMode("url")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === "url"
                ? "bg-ayurveda-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ImageIcon size={16} className="inline mr-2" />
            Enter URL
          </button>
        </div>

        {/* File Upload */}
        {uploadMode === "file" && (
          <div className="mb-4">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
              disabled={uploadingImage}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-ayurveda-green file:text-white hover:file:bg-ayurveda-green/90 disabled:opacity-50"
            />
            {uploadingImage && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="animate-spin" size={16} />
                <span>Uploading image...</span>
              </div>
            )}
          </div>
        )}

        {/* URL Input */}
        <input
          type="url"
          {...register("image_url")}
          placeholder="https://example.com/image.jpg"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ayurveda-green ${
            errors.image_url ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.image_url && (
          <p className="mt-1 text-sm text-red-500">{errors.image_url.message}</p>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="relative w-full max-w-md h-64 border rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EInvalid Image URL%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          {...register("title")}
          placeholder="e.g., Treatment Room"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ayurveda-green"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Optional description of the image"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ayurveda-green"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <input
          type="text"
          {...register("category")}
          placeholder="e.g., Treatment Room, Herbal Garden, etc."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ayurveda-green"
        />
      </div>

      {/* Display Order */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Display Order
        </label>
        <input
          type="number"
          {...register("display_order", { valueAsNumber: true })}
          min={0}
          placeholder="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ayurveda-green"
        />
        <p className="mt-1 text-xs text-gray-500">
          Lower numbers appear first. Use this to control the order of images in the gallery.
        </p>
      </div>

      {/* Status Messages */}
      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          Gallery image {image ? "updated" : "created"} successfully!
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          Failed to save gallery image. Please try again.
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="flex-1 bg-ayurveda-green text-white px-6 py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : image ? "Update Image" : "Add Image"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
