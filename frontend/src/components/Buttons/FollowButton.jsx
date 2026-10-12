import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

export default function FollowButton({ userId, onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve the current follow status
  useEffect(() => {
    let cancelled = false;

    async function loadFollowStatus() {
      setIsLoading(true);

      try {
        const response = await apiFetch(`/users/follow-status?id=${userId}`);

        if (!response.ok) {
          throw new Error("Unable to retrieve follow status.");
        }

        const data = await response.json();

        if (!cancelled) {
          setIsFollowing(data.following);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadFollowStatus();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Follow or unfollow the selected user
  async function handleFollow() {
    if (isSubmitting || isLoading) return;

    setIsSubmitting(true);

    try {
      const response = await apiFetch(`/users/follow?id=${userId}`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to update follow status.");
      }

      const nextStatus = !isFollowing;

      setIsFollowing(nextStatus);
      onFollowChange?.(nextStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleFollow}
      disabled={isLoading || isSubmitting}
      className={`rounded-full px-5 py-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        isFollowing
          ? "border border-neutral-600 bg-black text-white hover:border-red-500 hover:text-red-500"
          : "bg-white text-black hover:bg-neutral-200"
      }`}
    >
      {isLoading || isSubmitting
        ? "Loading..."
        : isFollowing
          ? "Unfollow"
          : "Follow"}
    </button>
  );
}
