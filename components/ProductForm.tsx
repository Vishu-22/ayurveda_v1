"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product } from "@/types";
import { 
  Package, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  X,
  Eye
} from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  detailed_description: z.string().optional(),
  price: z.number().min(0.01, "Price must be greater than 0"),
  in_stock: z.boolean().default(true),
  stock_quantity: z.number().min(0).optional(),
  category: z.string().optional(),
  dosage: z.string().optional(),
  ingredients: z.string().optional(),
  benefits: z.string().optional(),
  usage_instructions: z.string().optional(),
  weight: z.string().optional(),
  sku: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3 | 4;

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageInputs, setImageInputs] = useState<string[]>([""]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("file"); // Default to file upload

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          detailed_description: product.detailed_description,
          price: product.price,
          in_stock: product.inStock ?? product.in_stock ?? true,
          stock_quantity: product.stock_quantity || 0,
          category: product.category,
          dosage: product.dosage,
          ingredients: product.ingredients,
          benefits: product.benefits,
          usage_instructions: product.usage_instructions,
          weight: product.weight,
          sku: product.sku,
        }
      : {
          in_stock: true,
          stock_quantity: 0,
        },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        detailed_description: product.detailed_description,
        price: product.price,
        in_stock: product.inStock ?? product.in_stock ?? true,
        stock_quantity: product.stock_quantity || 0,
        category: product.category,
        dosage: product.dosage,
        ingredients: product.ingredients,
        benefits: product.benefits,
        usage_instructions: product.usage_instructions,
        weight: product.weight,
        sku: product.sku,
      });
      
      // Load images from product
      if (product.images && product.images.length > 0) {
        setImages(product.images);
        setImageInputs([...product.images, ""]);
        setUploadingImages(new Array(product.images.length + 1).fill(false));
      } else if (product.image_url) {
        setImages([product.image_url]);
        setImageInputs([product.image_url, ""]);
        setUploadingImages([false, false]);
      } else {
        setUploadingImages([false]);
      }
    } else {
      setUploadingImages([false]);
    }
  }, [product, reset]);

  const watchedValues = watch();

  const steps = [
    { number: 1, title: "Basic Information", icon: Package },
    { number: 2, title: "Product Details", icon: FileText },
    { number: 3, title: "Images", icon: ImageIcon },
    { number: 4, title: "Review", icon: CheckCircle },
  ];

  const validateStep = async (step: Step): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["name", "price"]);
      case 2:
        return true; // All fields optional
      case 3:
        return true; // Images optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleImageInputChange = (index: number, value: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = value;
    setImageInputs(newInputs);
    
    // Update images array with valid URLs
    const validImages = newInputs.filter(url => url.trim() !== "" && isValidUrl(url));
    setImages(validImages);
  };

  const addImageInput = () => {
    setImageInputs([...imageInputs, ""]);
    setUploadingImages([...uploadingImages, false]);
  };

  const removeImageInput = (index: number) => {
    const newInputs = imageInputs.filter((_, i) => i !== index);
    setImageInputs(newInputs.length > 0 ? newInputs : [""]);
    
    const newUploading = uploadingImages.filter((_, i) => i !== index);
    setUploadingImages(newUploading.length > 0 ? newUploading : [false]);
    
    const validImages = newInputs.filter(url => url.trim() !== "" && isValidUrl(url));
    setImages(validImages);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileUpload = async (file: File, index: number) => {
    // Validate file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size too large. Maximum size is 5MB.");
      return;
    }

    // Set uploading state
    const newUploading = [...uploadingImages];
    newUploading[index] = true;
    setUploadingImages(newUploading);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Get admin headers
      const adminEmail = localStorage.getItem("adminEmail");
      const headers: HeadersInit = {};
      if (adminEmail) {
        headers["x-admin-email"] = adminEmail;
        headers["x-admin-token"] = "authenticated";
      }

      // Upload file
      const response = await fetch("/api/upload/image", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      
      if (!data.url) {
        throw new Error("No URL returned from upload");
      }
      
      console.log("Upload successful, URL:", data.url);
      
      // Update the image input with the uploaded URL
      setImageInputs((prevInputs) => {
        const newInputs = [...prevInputs];
        newInputs[index] = data.url;
        
        // Update images array with valid URLs (including the new one)
        const updatedInputs = [...newInputs];
        const validImages = updatedInputs.filter(url => url.trim() !== "" && isValidUrl(url));
        setImages(validImages);
        
        return newInputs;
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      const newUploading = [...uploadingImages];
      newUploading[index] = false;
      setUploadingImages(newUploading);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      // Get admin authentication headers
      const adminEmail = localStorage.getItem("adminEmail");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (adminEmail) {
        headers["x-admin-email"] = adminEmail;
        headers["x-admin-token"] = "authenticated";
      }

      // Prepare data with images
      const submitData = {
        ...data,
        images: images.length > 0 ? images : [],
        image_url: images.length > 0 ? images[0] : null, // First image as primary
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error saving product:", errorData);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  {...register("category")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                  placeholder="e.g., Herbal, Supplements"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                placeholder="Brief description of the product"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="in_stock"
                {...register("in_stock")}
                className="h-5 w-5 text-ayurveda-green focus:ring-ayurveda-green border-gray-300 rounded"
              />
              <label htmlFor="in_stock" className="text-sm font-medium text-gray-700">
                Product is in stock
              </label>
            </div>

            {watchedValues.in_stock && (
              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  {...register("stock_quantity", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                id="detailed_description"
                rows={5}
                {...register("detailed_description")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                placeholder="Comprehensive product description"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  id="dosage"
                  {...register("dosage")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                  placeholder="e.g., 1-2 tablets daily"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  {...register("weight")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                  placeholder="e.g., 100g, 500ml"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                rows={3}
                {...register("ingredients")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                placeholder="List of ingredients"
              />
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <textarea
                id="benefits"
                rows={3}
                {...register("benefits")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                placeholder="Key benefits of the product"
              />
            </div>

            <div>
              <label htmlFor="usage_instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Usage Instructions
              </label>
              <textarea
                id="usage_instructions"
                rows={3}
                {...register("usage_instructions")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                placeholder="How to use this product"
              />
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                id="sku"
                {...register("sku")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                placeholder="e.g., AYUR-001"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Upload Mode Toggle */}
            <div className="flex gap-4 border-b pb-4">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  uploadMode === "file"
                    ? "bg-ayurveda-green text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  uploadMode === "url"
                    ? "bg-ayurveda-green text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Enter URL
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> {uploadMode === "file" 
                  ? "Upload images from your device. Maximum file size is 5MB. Supported formats: JPEG, PNG, WebP."
                  : "Enter image URLs. The first image will be used as the primary product image."}
              </p>
            </div>

            <div className="space-y-4">
              {imageInputs.map((url, index) => (
                <div key={index} className="flex gap-3">
                  {uploadMode === "file" ? (
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, index);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-ayurveda-green file:text-white hover:file:bg-ayurveda-green/90"
                        disabled={uploadingImages[index]}
                      />
                      {uploadingImages[index] && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-ayurveda-green"></span>
                          Uploading...
                        </p>
                      )}
                      {url && !uploadingImages[index] && isValidUrl(url) && (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle size={16} />
                          Uploaded successfully
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageInputChange(index, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-green focus:border-transparent transition-all"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                  {imageInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageInput(index)}
                      className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      disabled={uploadingImages[index]}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addImageInput}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-ayurveda-green hover:text-ayurveda-green transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Another Image
            </button>

            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Image Previews</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={imgUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EInvalid Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-ayurveda-green text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Product</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Product Name</h4>
                  <p className="text-gray-900">{watchedValues.name || "Not set"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Price</h4>
                  <p className="text-gray-900">₹{watchedValues.price?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                  <p className="text-gray-900">{watchedValues.category || "Not set"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Stock Status</h4>
                  <p className="text-gray-900">{watchedValues.in_stock ? "In Stock" : "Out of Stock"}</p>
                </div>
                {watchedValues.description && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-gray-900">{watchedValues.description}</p>
                  </div>
                )}
                {images.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Images ({images.length})</h4>
                    <div className="flex gap-2 flex-wrap">
                      {images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="w-16 h-16 rounded border overflow-hidden">
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {images.length > 4 && (
                        <div className="w-16 h-16 rounded border flex items-center justify-center text-sm text-gray-500">
                          +{images.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Please review all information before submitting. You can go back to edit any step.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-ayurveda-green text-white scale-110"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className={`text-xs mt-2 font-medium ${isActive ? "text-ayurveda-green" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              Product {product ? "updated" : "created"} successfully!
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              Something went wrong. Please try again.
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
              )}
              {onCancel && currentStep === 1 && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-ayurveda-green text-white rounded-lg hover:bg-ayurveda-green/90 transition-colors flex items-center gap-2 font-semibold"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-ayurveda-green text-white rounded-lg hover:bg-ayurveda-green/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      {product ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      {product ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
