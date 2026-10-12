import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { apiFetch } from "../services/api";
import Post from "../components/Feed/Post";

export default function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Retrieve the original post and its replies
  useEffect(() => {
    let cancelled = false;

    async function loadConversation() {
      setIsLoading(true);
      setError("");
      setPost(null);
      setReplies([]);

      try {
        const [postResponse, repliesResponse] = await Promise.all([
          apiFetch(`/posts/detail?id=${id}`),
          apiFetch(`/posts/replies?post_id=${id}`),
        ]);

        if (!postResponse.ok || !repliesResponse.ok) {
          throw new Error("Unable to retrieve conversation.");
        }

        const postData = await postResponse.json();
        const repliesData = await repliesResponse.json();

        if (!cancelled) {
          setPost(postData);
          setReplies(repliesData);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadConversation();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Refresh the post and its replies from the database
  async function refreshConversation() {
    try {
      const [postResponse, repliesResponse] = await Promise.all([
        apiFetch(`/posts/detail?id=${id}`),
        apiFetch(`/posts/replies?post_id=${id}`),
      ]);

      if (!postResponse.ok || !repliesResponse.ok) {
        throw new Error("Unable to refresh conversation.");
      }

      const postData = await postResponse.json();
      const repliesData = await repliesResponse.json();

      setPost(postData);
      setReplies(repliesData);
    } catch (error) {
      console.error("Conversation refresh error:", error);
    }
  }

  // Remove a deleted reply or redirect after deleting the original post
  async function handlePostDeleted(postId) {
    if (Number(postId) === Number(id)) {
      navigate("/home", { replace: true });
      return;
    }

    await refreshConversation();
  }
  // Update an edited post or reply
  function handlePostUpdated(updatedPost) {
    if (Number(updatedPost.id) === Number(post?.id)) {
      setPost((previousPost) => ({
        ...previousPost,
        ...updatedPost,
      }));
    }

    setReplies((previousReplies) =>
      previousReplies.map((reply) =>
        Number(reply.id) === Number(updatedPost.id)
          ? { ...reply, ...updatedPost }
          : reply,
      ),
    );
  }

  // Refresh the conversation after publishing a reply
  async function handleReplyCreated() {
    await refreshConversation();
  }

  if (isLoading) {
    return <p className="p-6 text-neutral-500">Loading conversation...</p>;
  }

  if (error || !post) {
    return <p className="p-6 text-red-500">{error || "Post not found."}</p>;
  }

  return (
    <section className="min-h-screen">
      {/* Conversation header */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-8 border-b border-neutral-800 bg-black/90 px-4 backdrop-blur">
        <Link
          to="/home"
          aria-label="Back to home"
          className="rounded-full p-2 hover:bg-neutral-900"
        >
          <IoArrowBack className="text-xl" />
        </Link>

        <h1 className="text-xl font-bold">Post</h1>
      </header>

      {/* Original post */}
      <Post
        post={post}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        onReplyCreated={handleReplyCreated}
      />

      {/* Replies */}
      <div>
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Post
              key={reply.id}
              post={reply}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
              onReplyCreated={handleReplyCreated}
            />
          ))
        ) : (
          <p className="p-8 text-center text-neutral-500">No replies yet.</p>
        )}
      </div>
    </section>
  );
}
