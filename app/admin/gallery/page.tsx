"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GalleryImage } from "@/types";
import GalleryForm from "@/components/GalleryForm";
import GalleryList from "@/components/GalleryList";

export default function AdminGalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is already logged in
    const adminEmail = localStorage.getItem("adminEmail");
    const expectedAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    
    if (adminEmail && adminEmail === expectedAdminEmail) {
      setIsAuthenticated(true);
    } else {
      // Redirect to admin login if not authenticated
      router.push("/admin");
    }
  }, [router]);

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingImage(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingImage(null);
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh
  };

  const handleDelete = () => {
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh after delete
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ayurveda-green/5 to-white">
        <div className="text-center">
          <p className="text-xl text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ayurveda-green/5 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-ayurveda-green hover:text-ayurveda-green/80 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-serif font-bold text-ayurveda-green">
            Gallery Management
          </h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-ayurveda-green text-white px-6 py-3 rounded-md hover:bg-ayurveda-green/90 transition-colors font-semibold flex items-center gap-2"
            >
              <span>+</span> Add New Image
            </button>
          )}
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif font-semibold text-ayurveda-green mb-6">
              {editingImage ? "Edit Gallery Image" : "Add New Gallery Image"}
            </h2>
            <GalleryForm
              image={editingImage || undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <GalleryList
              onEdit={handleEdit}
              onDelete={handleDelete}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
      </div>
    </div>
  );
}
