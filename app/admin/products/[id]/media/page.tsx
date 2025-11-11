"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/NavBar";
import { ArrowLeft, Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Media {
  id: string;
  url: string;
  publicId: string;
  mediaType: string;
  position: number;
  altText: string | null;
  width: number;
  height: number;
  format: string;
  size: number;
}

export default function ProductMediaPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper function to ensure full Cloudinary URL
  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    // If already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's just a public ID or partial path, construct full URL
    // This shouldn't happen, but just in case
    console.warn('⚠️ Incomplete URL detected:', url);
    return url;
  };

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin && productId) {
      fetchMedia();
    }
  }, [isAdmin, productId]);

  const fetchMedia = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/products/${productId}/media`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setMedia(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("media", file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/products/${productId}/media`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(`${files.length} image(s) uploaded successfully!`);
        await fetchMedia();
        e.target.value = "";
      } else {
        setError(data.error || "Failed to upload images");
      }
    } catch (error) {
      setError("An error occurred while uploading images");
      console.error("Image upload error:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingVideos(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("media", file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/products/${productId}/media`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(`${files.length} video(s) uploaded successfully!`);
        await fetchMedia();
        e.target.value = "";
      } else {
        setError(data.error || "Failed to upload videos");
      }
    } catch (error) {
      setError("An error occurred while uploading videos");
      console.error("Video upload error:", error);
    } finally {
      setUploadingVideos(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/products/media/${mediaId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Image deleted successfully");
        fetchMedia();
      } else {
        setError(data.error || "Failed to delete image");
      }
    } catch (err) {
      setError("An error occurred while deleting");
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/admin/products"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Product Media</h1>
          <p className="text-gray-600 mt-1">Upload and manage product images</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Images Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">📸 Upload Images</h3>
              <span className="text-sm text-gray-500">
                {media.filter(m => m.mediaType === 'image').length} images
              </span>
            </div>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-blue-50">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImages || uploadingVideos}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploadingImages ? (
                  <>
                    <Loader2 className="h-12 w-12 text-indigo-600 mb-4 animate-spin" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Uploading...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-blue-400 mb-3" />
                    <p className="text-md font-semibold text-gray-900 mb-1">
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-600">
                      PNG, JPG, GIF • Up to 10MB each
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-2">
                      ✨ Select multiple files
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Videos Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">🎥 Upload Videos</h3>
              <span className="text-sm text-gray-500">
                {media.filter(m => m.mediaType === 'video').length} videos
              </span>
            </div>
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors bg-purple-50">
              <input
                type="file"
                id="video-upload"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={uploadingImages || uploadingVideos}
                className="hidden"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploadingVideos ? (
                  <>
                    <Loader2 className="h-12 w-12 text-purple-600 mb-4 animate-spin" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Uploading...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-purple-400 mb-3" />
                    <p className="text-md font-semibold text-gray-900 mb-1">
                      Click to upload videos
                    </p>
                    <p className="text-xs text-gray-600">
                      MP4, MOV, AVI • Up to 100MB each
                    </p>
                    <p className="text-xs text-purple-600 font-medium mt-2">
                      ✨ Select multiple files
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Uploaded Media ({media.length})
          </h2>

          {media.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w
              -16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No media yet
              </h3>
              <p className="text-gray-600">
                Upload your first images or videos using the forms above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                >
                  <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.url}
                        controls
                        className="max-w-full max-h-full object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <Image
                          // width={500}
                          // height={500}
                          fill
                     src={item.url}
                          alt={item.altText || "Product media"}
                          className="object-contain"
                          // style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }}
                          onLoad={() => console.log('✅ Image loaded:', item.url)}
                          onError={() => {
                            console.error('❌ Image failed to load:', item.url);
                            console.error('Full item:', item);
                          }}
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.mediaType === 'video' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.mediaType === 'video' ? '🎥 Video' : '📸 Image'}
                      </span>
                      <p className="text-xs text-gray-500">
                        Pos: {item.position}
                      </p>
                    </div>
                    {item.altText && (
                      <p className="text-sm text-gray-700 mt-1 truncate">
                        {item.altText}
                      </p>
                    )}
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <p className="text-gray-600 font-mono truncate" title={item.url}>
                        🔗 {item.url.split('/').pop()}
                      </p>
                      <p className="text-gray-500 text-[10px] mt-1">
                        {item.width} × {item.height}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
