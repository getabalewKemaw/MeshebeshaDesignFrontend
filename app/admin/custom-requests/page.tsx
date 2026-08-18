"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageSquare, Eye } from "lucide-react";
import Image from "next/image";
interface CustomRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  media?: string[];
  user: {
    name: string;
    email: string;
  };
}
export default function CustomRequestsPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/custom-requests`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!isAdmin) {
    return null;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Custom Requests</h1>
        <p className="text-gray-600 mt-1">Manage customer design requests</p>
      </div>
      {/* Filters */}
      <div className="bg-white shadow-sm p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${filter === "all"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("submitted")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${filter === "submitted"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${filter === "in_progress"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${filter === "completed"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${filter === "rejected"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No requests found
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "No custom requests yet"
              : `No ${filter} requests`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {request.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    From: {request.user.name} ({request.user.email})
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-2">
                {request.description}
              </p>

              {/* Media Previews */}
              {request.media && Array.isArray(request.media) && request.media.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {request.media.map((url, index) => (
                    <div key={index} className="relative h-16 w-16 flex-shrink-0 border rounded-md overflow-hidden bg-gray-50">
                      {url.includes('/video/') || url.endsWith('.mp4') ? (
                        <video src={url} className="h-full w-full object-cover" />
                      ) : (
                        <Image
                         width={500}
                         height={500}
                          src={url}
                          alt={`Request attachment ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
