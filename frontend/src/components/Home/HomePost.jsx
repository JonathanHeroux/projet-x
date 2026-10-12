import { useEffect, useState } from "react";
import { GrEmoji } from "react-icons/gr";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { TbFlag3 } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { RiListRadio } from "react-icons/ri";
import { RiGrokAiLine } from "react-icons/ri";
import { HiOutlinePhotograph } from "react-icons/hi";
import { GoPlus } from "react-icons/go";
import { IoEarthSharp } from "react-icons/io5";
import { apiFetch } from "../../services/api";

// Define the maximum allowed post length
const maxLength = 276;
// Define the available actions in the post composer
const postActions = [
  {
    label: "Media",
    icon: HiOutlinePhotograph,
  },
  {
    label: "GIF",
    icon: HiOutlineGif,
  },
  {
    label: "Grok",
    icon: RiGrokAiLine,
  },
  {
    label: "Poll",
    icon: RiListRadio,
  },
  {
    label: "Emoji",
    icon: GrEmoji,
  },
  {
    label: "Schedule",
    icon: RiCalendarScheduleLine,
  },
  {
    label: "Location",
    icon: CiLocationOn,
    disabled: true,
  },
  {
    label: "Flag",
    icon: TbFlag3,
  },
];

export default function HomePost({ onPostCreated }) {
  // Store the current post content
  const [content, setContent] = useState("");
  // Prevent multiple submissions while the request is processing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    async function loadAvatar() {
      try {
        const response = await apiFetch("/me");
        if (!response.ok) return;

        const user = await response.json();
        setAvatar(user.avatar);
      } catch (error) {
        console.error("Avatar loading error:", error);
      }
    }

    loadAvatar();
  }, []);

  // Calculate the remaining characters
  const remaining = maxLength - content.length;
  //   Algo made by IA
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = content.length / maxLength;
  const offset = circumference * (1 - progress);

  // Validate and send the new post to the API
  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0 || isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await apiFetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedContent,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to create the post.");
      }
      const newPost = await response.json();
      // Send the newly created post back to the parent component
      onPostCreated(newPost);
      setContent("");
    } catch (error) {
      console.error("Post creattion error:", error);
    } finally {
      // Restore the submit state whether the request succeeds or fails
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <div className="flex min-w-0 gap-2 px-3 py-5 sm:px-4 sm:py-7 border-b border-neutral-700">
        <img
          src={avatar || "/x_default_profile_picture.jpg"}
          className="rounded-full w-10 h-10 sm:w-13 sm:h-13 shrink-0 object-cover"
        />
        <form className="group/composer flex-1 min-w-0" onSubmit={handleSubmit}>
          {/* Textarea to post */}
          <div className="border-b border-transparent group-focus-within/composer:border-neutral-700">
            <textarea
              value={content}
              placeholder="What's happening?"
              maxLength={maxLength}
              className="text-2xl text-neutral-500 resize-none outline-none overflow-hidden field-sizing-content w-full group-focus-within/composer:pb-6 transition-all ease-out"
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="button"
              className="mb-3 flex items-center rounded-full gap-1 px-3 py-0.5 transition-all text-sm font-semibold text-sky-500 invisible opacity-0 duration-200 ease-out group-focus-within/composer:visible group-focus-within/composer:opacity-100 hover:bg-sky-800/20"
            >
              <IoEarthSharp className="text-base" />
              Everyone can reply
            </button>
          </div>
          {/* Icons */}
          <div className="flex min-w-0 items-center pt-2">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
              {/* Generate each available composer action */}
              {postActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    disabled={action.disabled}
                    title={action.label}
                    className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-neutral-700 ease-out disabled:cursor-default disabled:hover:bg-transparent"
                  >
                    <Icon className="text-2xl text-neutral-600 duration-200 group-hover:scale-110 transition-transform group-hover:text-neutral-400 ease-out group-disabled:group-hover:scale-100 group-disabled:text-neutral-800 " />
                  </button>
                );
              })}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">
              {/* Progress circle and add another post */}
              <div className="flex items-center gap-3">
                {content.length > 0 && (
                  <>
                    {/* Progress circle by IA */}
                    <div className="h-8 w-8">
                      <svg viewBox="0 0 24 24" className="h-8 w-8 -rotate-90">
                        <circle
                          cx="12"
                          cy="12"
                          r={radius}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-neutral-700"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r={radius}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          className="text-sky-500 transition-all duration-200 ease-out"
                        />
                      </svg>
                    </div>
                    <div className="h-7 border-l border-neutral-700" />
                    {/* Another post */}
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700 text-sky-500 hover:bg-sky-800/20 transition-colors"
                    >
                      <GoPlus className="text-xl" />
                    </button>
                  </>
                )}

                {/* Post button */}
                <button
                  type="submit"
                  disabled={content.trim().length === 0 || isSubmitting}
                  className="flex items-center justify-center font-semibold bg-white w-17 h-10 rounded-full text-black disabled:opacity-20"
                >
                  {isSubmitting ? "..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="flex items-center justify-center border-b border-neutral-700 py-3">
        <span className="text-sky-500">Show posts</span>
      </div>
    </>
  );
}
