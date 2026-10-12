import Post from "./Post";
import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

// const posts = [
//   {
//     id: 1,
//     name: "Jonathan Heroux",
//     username: "@JonathanHeroux",
//     avatar: "/x_default_profile_picture.jpg",
//     content: "Voici mon premier post sur X",
//     media: "/logo-x.jpg",
//     repliesCount: 6,
//     repostsCount: 2,
//     likesCount: 1,
//     viewsCount: 4,
//   },
//   {
//     id: 2,
//     name: "Elon Musk",
//     username: "@ElonMusk",
//     avatar: "/x_default_profile_picture.jpg",
//     content: "Grok va tout pulvériser!",
//     media: "/logo-x.jpg",
//     repliesCount: 900,
//     repostsCount: 876,
//     likesCount: 567,
//     viewsCount: 4200,
//   },
//   {
//     id: 3,
//     name: "Mark Zuckerberg",
//     username: "@MarkZuckerberg",
//     avatar: "/x_default_profile_picture.jpg",
//     content: "Facebook est la plateforme n'1!",
//     media: "/logo-x.jpg",
//     repliesCount: 500,
//     repostsCount: 344,
//     likesCount: 788,
//     viewsCount: 100,
//   },
// ];

export default function Feed({ posts, onPostDeleted, onPostUpdated }) {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function loadCurrentUser() {
      const response = await apiFetch("/me");

      if (response.ok) {
        const user = await response.json();
        setCurrentUserId(Number(user.id));
      }
    }

    loadCurrentUser();
  }, []);
  return (
    // Show post
    <div>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            post={post}
            onPostDeleted={onPostDeleted}
            onPostUpdated={onPostUpdated}
            currentUserId={currentUserId}
          />
        );
      })}
    </div>
  );
}
