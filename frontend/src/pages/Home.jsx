import HomeHeader from "../components/Home/HomeHeader";
import RootLayout from "../layouts/RootLayout";
import HomePost from "../components/Home/HomePost";
import Feed from "../components/Feed/Feed";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Home() {
  const [posts, setPosts] = useState([]);

  // Store the selected feed tab
  const [activeTab, setActiveTab] = useState("For you");
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve posts for the selected feed tab
  useEffect(() => {
    let cancelled = false;

    const endpoint = activeTab === "Following" ? "/posts/following" : "/posts";

    setIsLoading(true);

    apiFetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch posts.");
        }

        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setPosts(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Posts fetch error:", error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);
  // New post with previous ones
  function handlePostCreated(newPost) {
    setPosts((previousPosts) => [newPost, ...previousPosts]);
  }
  function handlePostDeleted(postId) {
    setPosts((previousPosts) =>
      previousPosts.filter((post) => post.id !== postId),
    );
  }
  function handlePostUpdated(updatedPost) {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post,
      ),
    );
  }
  return (
    <section>
      <HomeHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <HomePost onPostCreated={handlePostCreated} />
      {isLoading ? (
        <p className="p-6 text-center text-neutral-500">Loading posts...</p>
      ) : posts.length === 0 && activeTab === "Following" ? (
        <p className="p-6 text-center text-neutral-500">
          No posts from accounts you follow yet.
        </p>
      ) : (
        <Feed
          posts={posts}
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </section>
  );
}
