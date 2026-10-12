import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { apiFetch } from "../services/api";
import Feed from "../components/Feed/Feed";
import FollowButton from "../components/Buttons/FollowButton";

export default function Profile() {
  const { username } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // Retrieve the authenticated user and the requested profile
  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setError("");
      setProfile(null);
      setPosts([]);

      try {
        const meResponse = await apiFetch("/me");

        if (!meResponse.ok) {
          throw new Error("Unable to retrieve your account.");
        }

        const me = await meResponse.json();
        setCurrentUser(me);

        // Use the authenticated user's username for /profile
        const requestedUsername = username ?? me.username;

        const profileResponse = await apiFetch(
          `/users/profile?username=${encodeURIComponent(requestedUsername)}`,
        );

        if (!profileResponse.ok) {
          throw new Error("Profile not found.");
        }

        const profileData = await profileResponse.json();

        const postsResponse = await apiFetch(
          `/users/posts?user_id=${profileData.id}`,
        );

        if (!postsResponse.ok) {
          throw new Error("Unable to retrieve profile posts.");
        }

        const postsData = await postsResponse.json();

        setProfile(profileData);
        setPosts(postsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [username]);

  // Remove a deleted post from the profile feed
  function handlePostDeleted(postId) {
    setPosts((previousPosts) =>
      previousPosts.filter((post) => post.id !== postId),
    );
  }

  // Update an edited post in the profile feed
  function handlePostUpdated(updatedPost) {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post,
      ),
    );
  }

  // Select an avatar and display a preview
  function handleAvatarSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Only JPG, PNG and WebP images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 2 MB.");
      return;
    }

    setAvatarError("");
    setSelectedAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  // Upload the selected avatar
  async function handleAvatarSave() {
    if (!selectedAvatar || isSavingAvatar) return;

    setIsSavingAvatar(true);
    setAvatarError("");

    try {
      const formData = new FormData();
      formData.append("avatar", selectedAvatar);

      const response = await apiFetch("/users/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to update avatar.");
      }

      const data = await response.json();

      setProfile((previousProfile) => ({
        ...previousProfile,
        avatar: data.avatar,
      }));

      // Notify other components that the account avatar changed
      window.dispatchEvent(
        new CustomEvent("avatar-updated", {
          detail: { avatar: data.avatar },
        }),
      );

      setIsEditProfileOpen(false);
      setSelectedAvatar(null);
      setAvatarPreview(null);
    } catch (error) {
      setAvatarError(error.message);
    } finally {
      setIsSavingAvatar(false);
    }
  }

  if (isLoading) {
    return <p className="p-6 text-neutral-500">Loading profile...</p>;
  }

  if (error || !profile) {
    return <p className="p-6 text-red-500">{error || "Profile not found."}</p>;
  }

  const isOwnProfile = Number(currentUser?.id) === Number(profile.id);

  // Update the followers count after a follow action
  function handleFollowChange(isFollowing) {
    setProfile((previousProfile) => ({
      ...previousProfile,
      followers_count:
        Number(previousProfile.followers_count) + (isFollowing ? 1 : -1),
    }));
  }

  return (
    <section className="min-h-screen">
      {/* Profile header */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-8 border-b border-neutral-800 bg-black/90 px-4 backdrop-blur">
        <Link
          to="/home"
          aria-label="Back to home"
          className="rounded-full p-2 hover:bg-neutral-900"
        >
          <IoArrowBack className="text-xl" />
        </Link>

        <div>
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-xs text-neutral-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </header>

      {/* Profile banner */}
      <div className="h-48 bg-neutral-800" />

      {/* Profile information */}
      <div className="px-4">
        <div className="-mt-16 flex items-end justify-between">
          <img
            src={profile.avatar || "/x_default_profile_picture.jpg"}
            alt={`${profile.name}'s avatar`}
            className="h-32 w-32 rounded-full border-4 border-black bg-neutral-800 object-cover"
          />

          <div className="pb-3">
            {isOwnProfile ? (
              <button
                type="button"
                className="rounded-full border border-neutral-600 px-4 py-2 font-bold hover:bg-neutral-900"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit profile
              </button>
            ) : (
              <FollowButton
                userId={profile.id}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-neutral-500">@{profile.username}</p>

          <p className="mt-3 text-sm text-neutral-500">
            Joined{" "}
            {new Date(profile.created_at.replace(" ", "T")).toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              },
            )}
          </p>

          <div className="mt-3 flex gap-5 text-sm">
            <span>
              <strong className="text-white">{profile.following_count}</strong>
              <span className="ml-1 text-neutral-500">Following</span>
            </span>

            <span>
              <strong className="text-white">{profile.followers_count}</strong>
              <span className="ml-1 text-neutral-500">Followers</span>
            </span>
          </div>
        </div>
      </div>

      {/* Profile navigation */}
      <nav className="mt-6 flex border-b border-neutral-800">
        <div className="relative flex flex-1 justify-center py-4 font-bold">
          Posts
          <span className="absolute bottom-0 h-1 w-14 rounded-full bg-sky-500" />
        </div>
      </nav>

      {/* User posts */}
      {posts.length > 0 ? (
        <Feed
          posts={posts}
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
        />
      ) : (
        <p className="p-8 text-center text-neutral-500">
          This user hasn't posted yet.
        </p>
      )}
      {/* Edit profile modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-black p-6">
            <h2 className="mb-6 text-xl font-bold">Edit profile</h2>

            <div className="flex flex-col items-center gap-4">
              <img
                src={
                  avatarPreview ||
                  profile.avatar ||
                  "/x_default_profile_picture.jpg"
                }
                alt="Avatar preview"
                className="h-32 w-32 rounded-full object-cover"
              />

              <label className="cursor-pointer rounded-full border border-neutral-600 px-4 py-2 font-bold hover:bg-neutral-900">
                Choose image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
              </label>

              {avatarError && (
                <p className="text-sm text-red-500">{avatarError}</p>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditProfileOpen(false);
                  setSelectedAvatar(null);
                  setAvatarPreview(null);
                  setAvatarError("");
                }}
                className="rounded-full border border-neutral-600 px-4 py-2 font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAvatarSave}
                disabled={!selectedAvatar || isSavingAvatar}
                className="rounded-full bg-white px-5 py-2 font-bold text-black disabled:opacity-50"
              >
                {isSavingAvatar ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
