import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { apiFetch } from "../services/api";
import FollowButton from "../components/Buttons/FollowButton";

export default function Follow() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFollowing() {
      try {
        const response = await apiFetch("/users/following");

        if (!response.ok) {
          throw new Error("Unable to retrieve followed users.");
        }

        const data = await response.json();

        if (!cancelled) {
          setUsers(data);
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

    loadFollowing();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleFollowChange(userId, isFollowing) {
    if (!isFollowing) {
      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== userId),
      );
    }
  }

  return (
    <section className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-6 border-b border-neutral-800 bg-black/90 px-4 backdrop-blur">
        <Link
          to="/home"
          aria-label="Back to home"
          className="rounded-full p-2 hover:bg-neutral-900"
        >
          <IoArrowBack className="text-xl" />
        </Link>

        <h1 className="text-xl font-bold">Following</h1>
      </header>

      {/* Following list */}
      <div className="py-4">
        {isLoading ? (
          <p className="px-4 text-neutral-500">Loading following...</p>
        ) : error ? (
          <p className="px-4 text-red-500">{error}</p>
        ) : users.length === 0 ? (
          <p className="px-4 text-neutral-500">
            You aren't following anyone yet.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 border-b border-neutral-800 px-4 py-4"
            >
              {/* User avatar */}
              <Link
                to={`/profile/${encodeURIComponent(user.username)}`}
                className="shrink-0"
              >
                <img
                  src={user.avatar || "/x_default_profile_picture.jpg"}
                  alt={`${user.name}'s avatar`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </Link>

              {/* User information */}
              <Link
                to={`/profile/${encodeURIComponent(user.username)}`}
                className="min-w-0 flex-1"
              >
                <p className="truncate font-bold hover:underline">
                  {user.name}
                </p>
                <p className="truncate text-sm text-neutral-500">
                  @{user.username}
                </p>
              </Link>

              {/* Follow / Unfollow */}
              <div className="shrink-0">
                <FollowButton
                  userId={user.id}
                  onFollowChange={(isFollowing) =>
                    handleFollowChange(user.id, isFollowing)
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
