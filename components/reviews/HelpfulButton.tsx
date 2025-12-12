"use client";

import { useState } from "react";
import { markReviewHelpful } from "@/lib/api/reviews";

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

  const handleHelpful = async () => {
    if (isLoading || userVote === "helpful") return;

    setIsLoading(true);
    try {
      const response = await markReviewHelpful(reviewId, true);
      if (response.success && response.data) {
        setHelpfulCount(response.data.helpfulCount+1);
        setNotHelpfulCount(response.data.notHelpfulCount);
        setUserVote("helpful");
        if (onVote) {
          onVote(response.data.helpfulCount, response.data.notHelpfulCount);
        }
      }
    } catch (error) {
      console.error("Failed to mark review as helpful:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotHelpful = async () => {
    if (isLoading || userVote === "not-helpful") return;

    setIsLoading(true);
    try {
      const response = await markReviewHelpful(reviewId, false);
      if (response.success && response.data) {
        setHelpfulCount(response.data.helpfulCount);
        setNotHelpfulCount(response.data.notHelpfulCount +1);
        setUserVote("not-helpful");
        if (onVote) {
          onVote(response.data.helpfulCount, response.data.notHelpfulCount);
        }
      }
    } catch (error) {
      console.error("Failed to mark review as not helpful:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
      <button
        onClick={handleHelpful}
        disabled={isLoading}
        className={`
          flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors
          ${userVote === "helpful" ? "text-green-600 font-semibold" : ""}
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
        Helpful ({helpfulCount})
      </button>
      <button
        onClick={handleNotHelpful}
        disabled={isLoading}
        className={`
          flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors
          ${userVote === "not-helpful" ? "text-red-600 font-semibold" : ""}
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
          />
        </svg>
        Not Helpful ({notHelpfulCount})
      </button>
    </div>
  );
}





