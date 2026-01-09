"use client";

import { useState, useEffect } from "react";
import { GalleryImage } from "@/types";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/gallery");
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

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-ayurveda-green/5 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-ayurveda-green mb-4">
            Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a visual journey through our wellness center and treatments.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No gallery images available yet.</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title || "Gallery image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EBroken Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-ayurveda-green/0 group-hover:bg-ayurveda-green/20 transition-colors flex items-center justify-center">
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-center px-4">
                    {image.title || image.description || "View Image"}
                  </p>
                </div>
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold">{image.title}</p>
                    {image.description && (
                      <p className="text-white/90 text-sm mt-1 line-clamp-1">
                        {image.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors z-10"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || "Gallery image"}
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23e5e7eb' width='800' height='600'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EBroken Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            {(selectedImage.title || selectedImage.description) && (
              <div className="p-6">
                {selectedImage.title && (
                  <h3 className="text-2xl font-serif font-bold text-ayurveda-green mb-2">
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.description && (
                  <p className="text-gray-600">{selectedImage.description}</p>
                )}
                {selectedImage.category && (
                  <span className="inline-block mt-3 px-3 py-1 bg-ayurveda-green/10 text-ayurveda-green rounded-full text-sm">
                    {selectedImage.category}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
