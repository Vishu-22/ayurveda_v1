"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { GalleryImage } from "@/types";
import { getAdminHeaders } from "@/lib/admin-auth";

interface GalleryListProps {
  onEdit?: (image: GalleryImage) => void;
  onDelete?: (imageId: string) => void;
  refreshTrigger?: number;
}

export default function GalleryList({ onEdit, onDelete, refreshTrigger }: GalleryListProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [refreshTrigger]);

  const fetchImages = async () => {
    try {
      const headers = getAdminHeaders();
      const response = await fetch("/api/admin/gallery", { headers });
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;

    try {
      const headers = getAdminHeaders();
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        setImages(images.filter((img) => img.id !== imageId));
        if (onDelete) {
          onDelete(imageId);
        }
      } else {
        alert("Failed to delete gallery image");
      }
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      alert("Error deleting gallery image");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading gallery images...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-ayurveda-green">
          Gallery Images ({images.length})
        </h2>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No gallery images found.</p>
          <p className="text-sm text-gray-500">Add your first image to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EBroken Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => onEdit && onEdit(image)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white rounded transition-colors shadow-sm"
                    aria-label="Edit image"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id!)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-white rounded transition-colors shadow-sm"
                    aria-label="Delete image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {image.title || "Untitled"}
                </h3>
                {image.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  {image.category && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {image.category}
                    </span>
                  )}
                  {image.display_order !== undefined && (
                    <span>Order: {image.display_order}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
