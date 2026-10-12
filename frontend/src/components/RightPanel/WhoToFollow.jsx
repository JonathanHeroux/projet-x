// Temporary suggested users data
const whoToFollow = [
  {
    name: "Jonathan Heroux",
    username: "@JonathanHeroux",
    avatar: "/x_default_profile_picture.jpg",
  },
  {
    name: "Elon Musk",
    username: "@ElonMusk",
    avatar: "/x_default_profile_picture.jpg",
  },
  {
    name: "Mark Zuckerberg",
    username: "@MarkZuckerberg",
    avatar: "/x_default_profile_picture.jpg",
  },
];
export default function WhoToFollow() {
  return (
    <section className="border border-neutral-800 py-3 rounded-2xl mt-4 overflow-hidden">
      {/* Section header */}
      <div className="mx-4">
        <h2 className="text-2xl font-bold">Who to follow</h2>
      </div>

      {/* Render suggested user profiles */}
      {whoToFollow.map((whoToFollowItem) => {
        return (
          <div className="flex flex-1 items-center min-w-0 hover:bg-neutral-900 py-3 px-3 cursor-pointer">
            {/* User avatar */}
            <img
              src={whoToFollowItem.avatar}
              alt="Profil picture"
              className="rounded-full w-11 h-11 shrink-0"
            />
            {/* User information */}
            <div className="flex flex-1 text-left flex-col min-w-0 px-2 ">
              <div className="font-bold truncate">{whoToFollowItem.name}</div>
              <div className=" truncate text-neutral-500">
                {whoToFollowItem.username}
              </div>
            </div>

            <div className=" flex items-center">
              <button className=" rounded-full bg-white text-black w-25 font-bold py-2 cursor-pointer hover:bg-neutral-100 transition-colors">
                Follow
              </button>
            </div>
          </div>
        );
      })}
      {/* Display more suggested users */}
      <button className="text-left w-full text-sky-500 px-4 py-3 hover:bg-neutral-900 transition-colors">
        Show more
      </button>
    </section>
  );
}
