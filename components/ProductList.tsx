"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import { Product } from "@/types";

interface ProductListProps {
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  refreshTrigger?: number;
}

export default function ProductList({ onEdit, onDelete, refreshTrigger }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const fetchProducts = async () => {
    try {
      // For admin view, fetch from admin endpoint to get all products
      const adminEmail = localStorage.getItem("adminEmail");
      const headers: HeadersInit = {};
      
      if (adminEmail) {
        headers["x-admin-email"] = adminEmail;
        headers["x-admin-token"] = "authenticated";
      }

      // Use admin endpoint for authenticated admin access
      const response = await fetch("/api/admin/products", { headers });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Get admin authentication headers
      const adminEmail = localStorage.getItem("adminEmail");
      const headers: HeadersInit = {};
      
      if (adminEmail) {
        headers["x-admin-email"] = adminEmail;
        headers["x-admin-token"] = "authenticated";
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
        if (onDelete) {
          onDelete(productId);
        }
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-ayurveda-green">
          Products ({products.length})
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No products found.</p>
          <p className="text-sm text-gray-500">Create your first product to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-ayurveda-green/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                      {(() => {
                        const primaryImage = (product.images && product.images.length > 0) 
                          ? product.images[0] 
                          : (product.image_url || product.image);
                        return primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e7eb' width='64' height='64'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='8' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Img%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-ayurveda-green hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">₹{product.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.inStock ?? product.in_stock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ?? product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.stock_quantity !== undefined && (
                      <span className="ml-2 text-sm text-gray-600">
                        ({product.stock_quantity})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{product.category || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit && onEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
