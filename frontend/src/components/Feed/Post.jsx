import { MdMoreHoriz } from "react-icons/md";
import { RiGrokAiFill } from "react-icons/ri";
import { BiMessageRounded } from "react-icons/bi";
import { BiRepost } from "react-icons/bi";
import { LuHeart } from "react-icons/lu";
import { IoStatsChart } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { RiShare2Line } from "react-icons/ri";
import { useRef, useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiEditLine } from "react-icons/ri";
import { RiPushpin2Line } from "react-icons/ri";
import { TbSparkleHighlight } from "react-icons/tb";
import { MdOutlinePostAdd } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import { IoChatbubbleOutline } from "react-icons/io5";
import { ImEmbed2 } from "react-icons/im";
import { TbSpeakerphone } from "react-icons/tb";

const postMenuActions = [
  {
    label: "Delete",
    action: "delete",
    icon: RiDeleteBinLine,
    danger: true,
  },
  {
    label: "Edit",
    action: "edit",
    icon: RiEditLine,
  },
  {
    label: "Pin to your profile",
    action: "pin",
    icon: RiPushpin2Line,
  },
  {
    label: "Highlight on your profile",
    action: "highlight",
    icon: TbSparkleHighlight,
  },
  {
    label: "Add/remove from Lists",
    action: "lists",
    icon: MdOutlinePostAdd,
  },
  {
    label: "Add/remove content disclosure",
    action: "disclosure",
    icon: RiInformationLine,
  },
  {
    label: "Change who can reply",
    action: "reply",
    icon: IoChatbubbleOutline,
  },
  {
    label: "View post activity",
    action: "activity",
    icon: IoStatsChart,
  },
  {
    label: "Embed post",
    action: "embed",
    icon: ImEmbed2,
  },
  {
    label: "View post analytics",
    action: "analytics",
    icon: IoStatsChart,
  },
  {
    label: "Request community note",
    action: "request",
    icon: TbSpeakerphone,
  },
];

export default function Post({ post, onPostDeleted, onPostUpdated }) {
  const postInteractions = [
    {
      label: "Reply",
      icon: BiMessageRounded,
      count: post.repliesCount ?? 0,
      hoverBg: "group-hover:bg-sky-500/10",
      hoverText: "group-hover:text-sky-500",
    },
    {
      label: "Repost",
      icon: BiRepost,
      count: post.repostsCount ?? 0,
      hoverBg: "group-hover:bg-green-500/10",
      hoverText: "group-hover:text-green-500",
    },
    {
      label: "Like",
      icon: LuHeart,
      count: post.likesCount ?? 0,
      hoverBg: "group-hover:bg-pink-500/10",
      hoverText: "group-hover:text-pink-500",
    },
    {
      label: "Views",
      icon: IoStatsChart,
      count: post.viewsCount ?? 0,
      hoverBg: "group-hover:bg-sky-500/10",
      hoverText: "group-hover:text-sky-500",
    },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  async function handleDelete() {
    try {
      const response = await fetch(`http://projet-x-api.local/?id=${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete post.");
      }

      onPostDeleted(post.id);
    } catch (error) {
      console.error("Post deletion error:", error);
    }
  }
  async function handleEdit() {
    const trimmedContent = editedContent.trim();

    if (trimmedContent.length === 0) {
      return;
    }

    try {
      const response = await fetch(`http://projet-x-api.local/?id=${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update post.");
      }

      const updatedPost = await response.json();

      onPostUpdated(updatedPost);
      setIsEditing(false);
    } catch (error) {
      console.error("Post update error:", error);
    }
  }
  function handleMenuAction(action) {
    if (action === "delete") {
      handleDelete();
    }

    if (action === "edit") {
      setEditedContent(post.content);
      setIsEditing(true);
      setIsMenuOpen(false);
    }
  }
  function formatPostDate(createdAt) {
    const createdDate = new Date(createdAt.replace(" ", "T"));
    const now = new Date();

    const differenceInSeconds = Math.floor((now - createdDate) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}s`;
    }

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes}m`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours < 24) {
      return `${differenceInHours}h`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays < 7) {
      return `${differenceInDays}d`;
    }

    return createdDate.toLocaleDateString();
  }
  return (
    <article className="flex gap-3 border-b border-neutral-800 px-4 py-3">
      {/* Avatar */}
      <img
        src={post.avatar}
        alt="avatar"
        className="h-13 w-13 rounded-full shrink-0"
      />
      {/* Post user */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1">
          <p className="font-bold shrink-0">{post.name}</p>
          <p className="text-neutral-500 truncate ">@{post.username}</p>
          <div className="text-neutral-500">·</div>
          <p className="text-neutral-500">{formatPostDate(post.created_at)}</p>
          <div className="ml-auto flex justify-center items-center">
            <button
              className="group flex h-9 w-9 items-center justify-center rounded-full
                 transition-colors duration-200 ease-out
                 hover:bg-sky-500/10"
            >
              <RiGrokAiFill className="text-neutral-500 transition-colors duration-200 group-hover:text-sky-500" />
            </button>
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((previous) => !previous)}
                className="group flex h-9 w-9 items-center justify-center rounded-full
                 transition-colors duration-200 ease-out
                 hover:bg-sky-500/10"
              >
                <MdMoreHoriz className="text-neutral-500 transition-colors duration-200 group-hover:text-sky-500" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-9 z-50 w-72 overflow-hidden rounded-2xl bg-neutral-950 py-2 shadow-xl">
                  {postMenuActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => handleMenuAction(action.action)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left font-semibold hover:bg-neutral-900 ${action.danger ? "text-red-500" : "text-white"}`}
                      >
                        {Icon && <Icon className="text-xl" />}
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text content */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedContent}
              maxLength={276}
              onChange={(event) => setEditedContent(event.target.value)}
              className="w-full resize-none rounded-lg border border-neutral-700 bg-black p-2 outline-none focus:border-sky-500"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full px-4 py-2 hover:bg-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-full bg-white px-4 py-2 font-semibold text-black"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 wrap-break-word">{post.content}</p>
        )}

        {/* Media content */}
        {post.media && (
          <div className="mt-3 w-full max-w-125">
            <div className="overflow-hidden rounded-2xl border border-neutral-800">
              <img
                src={post.media}
                alt="File media"
                className="w-full object-cover"
              />
            </div>
          </div>
        )}
        {/* Post actions */}
        {/* Post actions */}
        <div className="mt-3 flex items-center text-neutral-500">
          {/* Main interactions */}
          <div className="flex flex-1 items-center justify-between">
            {postInteractions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  title={action.label}
                  className="group flex items-center"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${action.hoverBg}`}
                  >
                    <Icon
                      className={`text-xl transition-colors duration-200 ease-out
                       ${action.hoverText}`}
                    />
                  </span>
                  <span
                    className={`text-sm transition-colors duration-200 ease-out ${action.hoverText}`}
                  >
                    {action.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bookmark + Share */}
          <div className="ml-6 flex items-center gap-1">
            <button
              type="button"
              title="Bookmark"
              className="group flex h-9 w-9 items-center justify-center rounded-full
                 transition-colors duration-200 ease-out
                 hover:bg-sky-500/10"
            >
              <IoBookmarkOutline className="text-xl transition-colors duration-200 group-hover:text-sky-500" />
            </button>

            <button
              type="button"
              title="Share"
              className="group flex h-9 w-9 items-center justify-center rounded-full
                 transition-colors duration-200 ease-out
                 hover:bg-sky-500/10"
            >
              <RiShare2Line className="text-xl transition-colors duration-200 group-hover:text-sky-500" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
