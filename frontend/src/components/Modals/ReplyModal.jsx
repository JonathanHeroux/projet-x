import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { apiFetch } from "../../services/api";

export default function ReplyModal({ post, onClose, onReplyCreated }) {
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Retrieve the authenticated user's information
  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await apiFetch("/me");

        if (!response.ok) {
          throw new Error("Unable to retrieve your account.");
        }

        const user = await response.json();

        if (!cancelled) {
          setCurrentUser(user);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      }
    }

    loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // Close the modal with Escape and prevent background scrolling
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Publish a reply to the selected post
  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmitting || !currentUser) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiFetch("/posts/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_id: post.id,
          content: trimmedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to publish your reply.");
      }

      const reply = await response.json();

      onReplyCreated?.(reply);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-start justify-center bg-sky-950/40 pt-12"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Reply to post"
        className="w-full max-w-150 rounded-2xl bg-black text-white shadow-2xl"
      >
        {/* Modal header */}
        <header className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reply modal"
            className="rounded-full p-2 hover:bg-neutral-900"
          >
            <IoClose className="text-2xl" />
          </button>

          <span className="text-sm font-semibold text-sky-500">Drafts</span>
        </header>

        {/* Original post */}
        <div className="flex gap-3 px-4 pt-3">
          <div className="flex flex-col items-center">
            <img
              src={post.avatar || "/x_default_profile_picture.jpg"}
              alt={`${post.name}'s avatar`}
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="mt-2 w-0.5 flex-1 bg-neutral-700" />
          </div>

          <div className="min-w-0 flex-1 pb-5">
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-bold">{post.name}</span>
              <span className="text-neutral-500">@{post.username}</span>
            </div>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word">
              {post.content}
            </p>
          </div>
        </div>

        {/* Reply composer */}
        <form onSubmit={handleSubmit}>
          <p className="mb-5 pl-17 text-sm text-neutral-500">
            Replying to <span className="text-sky-500">@{post.username}</span>
          </p>

          <div className="flex gap-3 px-4">
            <img
              src={currentUser?.avatar || "/x_default_profile_picture.jpg"}
              alt="Your avatar"
              className="h-10 w-10 rounded-full object-cover"
            />

            <textarea
              autoFocus
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={276}
              placeholder="Post your reply"
              className="min-h-40 w-full resize-none bg-transparent pt-2 text-xl outline-none placeholder:text-neutral-500"
            />
          </div>

          {error && <p className="px-4 text-sm text-red-500">{error}</p>}

          {/* Reply actions */}
          <div className="flex items-center justify-end gap-4 px-4 pb-4">
            <span className="text-sm text-neutral-500">
              {content.length}/276
            </span>

            <button
              type="submit"
              disabled={!content.trim() || isSubmitting || !currentUser}
              className="rounded-full bg-white px-5 py-2 font-bold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Replying..." : "Reply"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
  );
}
