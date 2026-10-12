import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../services/api";
import FollowButton from "../Buttons/FollowButton";

export default function ProfileHoverCard({
  username,
  onMouseEnter,
  onMouseLeave,
}) {
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Retrieve the hovered user's profile and the authenticated account
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const [profileResponse, meResponse] = await Promise.all([
          apiFetch(`/users/profile?username=${encodeURIComponent(username)}`),
          apiFetch("/me"),
        ]);

        if (!profileResponse.ok || !meResponse.ok) {
          throw new Error("Unable to retrieve profile.");
        }

        const profileData = await profileResponse.json();
        const meData = await meResponse.json();

        if (!cancelled) {
          setProfile(profileData);
          setCurrentUser(meData);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);

  // Update the displayed follower count
  function handleFollowChange(isFollowing) {
    setProfile((previousProfile) => ({
      ...previousProfile,
      followers_count:
        Number(previousProfile.followers_count) + (isFollowing ? 1 : -1),
    }));
  }

  if (!profile) return null;

  const isOwnProfile = Number(currentUser?.id) === Number(profile.id);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 top-full z-50 w-75 rounded-2xl border border-neutral-800 bg-black p-4 shadow-2xl"
    >
      {/* Avatar and follow button */}
      <div className="flex items-start justify-between">
        <Link to={`/profile/${encodeURIComponent(profile.username)}`}>
          <img
            src={profile.avatar || "/x_default_profile_picture.jpg"}
            alt={`${profile.name}'s avatar`}
            className="h-14 w-14 rounded-full"
          />
        </Link>

        {!isOwnProfile && (
          <FollowButton
            userId={profile.id}
            onFollowChange={handleFollowChange}
          />
        )}
      </div>

      {/* User information */}
      <div className="mt-3">
        <Link
          to={`/profile/${encodeURIComponent(profile.username)}`}
          className="font-bold hover:underline"
        >
          {profile.name}
        </Link>

        <p className="text-sm text-neutral-500">@{profile.username}</p>
      </div>

      {/* Follow counts */}
      <div className="mt-4 flex gap-4 text-sm">
        <span>
          <strong>{profile.following_count}</strong>
          <span className="ml-1 text-neutral-500">Following</span>
        </span>

        <span>
          <strong>{profile.followers_count}</strong>
          <span className="ml-1 text-neutral-500">Followers</span>
        </span>
      </div>
    </div>
  );
}
