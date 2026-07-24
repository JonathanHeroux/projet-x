import { MdMoreHoriz } from "react-icons/md";
import { RiGrokAiFill } from "react-icons/ri";
import { BiMessageRounded } from "react-icons/bi";
import { BiRepost } from "react-icons/bi";
import { LuHeart } from "react-icons/lu";
import { IoStatsChart } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { RiShare2Line } from "react-icons/ri";

export default function Post({ post }) {
  const postInteractions = [
    {
      label: "Reply",
      icon: BiMessageRounded,
      count: post.repliesCount,
    },
    {
      label: "Repost",
      icon: BiRepost,
      count: post.repostsCount,
    },
    {
      label: "Like",
      icon: LuHeart,
      count: post.likesCount,
    },
    {
      label: "Views",
      icon: IoStatsChart,
      count: post.viewsCount,
    },
  ];
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
          <p className="text-neutral-500 truncate ">{post.username}</p>
          <div className="text-neutral-500">·</div>
          <p className="text-neutral-500">20h</p>
          <div className="ml-auto flex justify-center items-center">
            <button>
              <RiGrokAiFill className="text-neutral-500" />
            </button>
            <button>
              <MdMoreHoriz className="text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Text content */}
        <p className="mt-1 wrap-break-word">{post.content}</p>
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
                  className="group flex items-center gap-1"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sky-500/10">
                    <Icon
                      className="text-xl transition-colors duration-200 ease-out
                       group-hover:text-sky-500"
                    />
                  </span>
                  <span className="text-sm group-hover:text-sky-500">
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
