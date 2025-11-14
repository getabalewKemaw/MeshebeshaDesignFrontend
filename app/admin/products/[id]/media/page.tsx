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
        { credentials: "include" }
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
    Array.from(files).forEach((file) => formData.append("media", file));

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
    } catch {
      setError("An error occurred while uploading images");
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
    Array.from(files).forEach((file) => formData.append("media", file));

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
    } catch {
      setError("An error occurred while uploading videos");
    } finally {
      setUploadingVideos(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Delete this media?")) return;

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
        setSuccess("Media deleted successfully");
        fetchMedia();
      } else {
        setError(data.error || "Failed to delete media");
      }
    } catch {
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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <a
            href="/admin/products"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Product Media</h1>
          <p className="text-gray-600 mt-1">Upload and manage product images and videos</p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upload Images */}
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
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                {uploadingImages ? (
                  <>
                    <Loader2 className="h-12 w-12 text-indigo-600 mb-4 animate-spin" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-blue-400 mb-3" />
                    <p className="text-md font-semibold text-gray-900 mb-1">Click to upload images</p>
                    <p className="text-xs text-gray-600">PNG, JPG, GIF • Up to 10MB each</p>
                    <p className="text-xs text-blue-600 font-medium mt-2">✨ Select multiple files</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Upload Videos */}
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
              <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                {uploadingVideos ? (
                  <>
                    <Loader2 className="h-12 w-12 text-purple-600 mb-4 animate-spin" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-purple-400 mb-3" />
                    <p className="text-md font-semibold text-gray-900 mb-1">Click to upload videos</p>
                    <p className="text-xs text-gray-600">MP4, MOV, AVI • Up to 100MB each</p>
                    <p className="text-xs text-purple-600 font-medium mt-2">✨ Select multiple files</p>
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
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No media yet</h3>
              <p className="text-gray-600">Upload your first images or videos using the forms above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition-colors bg-white"
                >
                  {/* Media Preview Container */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {item.mediaType === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <video
                          src={item.url}
                          controls
                          className="w-full h-full object-contain"
                          preload="metadata"
                          onLoadedData={() => console.log("Video loaded:", item.url)}
                          onError={() => console.error("Video failed:", item.url)}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white p-2">
                        <Image
                          src={item.url}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain"
                          alt={item.altText || "Product image"}
                          onLoad={() => console.log("Image loaded:", item.url)}
                          onError={() => console.error("Image failed:", item.url)}
                          unoptimized={true}
                        />
                      </div>
                    )}
                  </div>

                  {/* Hover Delete Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-transform"
                    >
                      <Trash2 className="h-5 w-5" />
                      Delete
                    </button>
                  </div>

                  {/* Media Info */}
                  <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.mediaType === "video"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.mediaType === "video" ? "🎥 Video" : "📸 Image"}
                      </span>
                      <p className="text-xs text-gray-500">Pos: {item.position}</p>
                    </div>

                    {item.altText && (
                      <p className="text-sm text-gray-700 mb-2 truncate" title={item.altText}>
                        {item.altText}
                      </p>
                    )}

                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <p className="text-gray-600 font-mono truncate" title={item.url}>
                        🔗 {item.publicId || item.url.split("/").pop()}
                      </p>
                      <div className="flex justify-between items-center mt-1 text-gray-500">
                        <span className="text-[10px]">
                          {item.width} × {item.height}
                        </span>
                        <span className="text-[10px]">
                          {item.size ? `${(item.size / 1024 / 1024).toFixed(1)}MB` : ''}
                        </span>
                      </div>
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

