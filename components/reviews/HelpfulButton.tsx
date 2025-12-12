"use client";

import { useState } from "react";
import { markReviewHelpful, markReviewNotHelpful } from "@/lib/api/reviews";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

interface HelpfulButtonProps {
  reviewId: string;
  initialHelpfulCount: number;
  initialNotHelpfulCount: number;
  onVote?: (helpfulCount: number, notHelpfulCount: number) => void;
}

export default function HelpfulButton({
  reviewId,
  initialHelpfulCount,
  initialNotHelpfulCount,
  onVote,
}: HelpfulButtonProps) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [notHelpfulCount, setNotHelpfulCount] = useState(initialNotHelpfulCount);
  const [userVote, setUserVote] = useState<"helpful" | "not-helpful" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleHelpful = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show generic message
      if (confirm("Please log in to vote on reviews.")) {
        router.push("/auth/login");
      }
      return;
    }

    if (isLoading || userVote === "helpful") return;
    if (!reviewId) return;

    setIsLoading(true);
    try {
      // Call endpoint specifically for marking helpful
      const response = await markReviewHelpful(reviewId, true);

      if (response.success && response.data) {
        setHelpfulCount(response.data.helpfulCount);
        setNotHelpfulCount(response.data.notHelpfulCount);
        setUserVote("helpful");
        if (onVote) {
          onVote(response.data.helpfulCount, response.data.notHelpfulCount);
        }
      } else {
        console.error("Failed to vote helpful:", response.error);
      }
    } catch (error) {
      console.error("Failed to mark review as helpful:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotHelpful = async () => {
    if (!isAuthenticated) {
      if (confirm("Please log in to vote on reviews.")) {
        router.push("/auth/login");
      }
      return;
    }

    if (isLoading || userVote === "not-helpful") return;
    if (!reviewId) return;

    setIsLoading(true);
    try {
      // Call endpoint specifically for marking not helpful
      const response = await markReviewNotHelpful(reviewId);

      if (response.success && response.data) {
        setHelpfulCount(response.data.helpfulCount);
        setNotHelpfulCount(response.data.notHelpfulCount);
        setUserVote("not-helpful");
        if (onVote) {
          onVote(response.data.helpfulCount, response.data.notHelpfulCount);
        }
      } else {
        console.error("Failed to vote not helpful:", response.error);
      }
    } catch (error) {
      console.error("Failed to mark review as not helpful:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-2 text-sm text-[#310101]/60">
      <button
        onClick={handleHelpful}
        disabled={isLoading}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300
          ${userVote === "helpful"
            ? "text-[#310101] bg-[#310101]/10 font-bold shadow-sm"
            : "hover:bg-[#310101]/5"}
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        title="Mark as helpful"
      >
        <svg
          className={`w-5 h-5 transition-transform ${userVote === 'helpful' ? 'scale-110' : ''}`}
          fill={userVote === "helpful" ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
        <span className="font-medium">({helpfulCount})</span>
      </button>

      <button
        onClick={handleNotHelpful}
        disabled={isLoading}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300
          ${userVote === "not-helpful"
            ? "text-[#310101] bg-[#310101]/10 font-bold shadow-sm"
            : "hover:bg-[#310101]/5"}
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        title="Mark as not helpful"
      >
        <svg
          className={`w-5 h-5 transition-transform ${userVote === 'not-helpful' ? 'scale-110' : ''}`}
          fill={userVote === "not-helpful" ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
          />
        </svg>
        <span className="font-medium">({notHelpfulCount})</span>
      </button>
    </div>
  );
}





