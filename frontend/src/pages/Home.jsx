import HomeHeader from "../components/Home/HomeHeader";
import RootLayout from "../layouts/RootLayout";
import HomePost from "../components/Home/HomePost";
import Feed from "../components/Feed/Feed";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  // Get the database informations and transform it to usable JS language
  useEffect(() => {
    fetch("http://projet-x-api.local")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fectch posts.");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Posts fetch error:", error);
      });
  }, []);
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
      <HomeHeader />
      <HomePost onPostCreated={handlePostCreated} />
      <Feed
        posts={posts}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
      />
    </section>
  );
}
