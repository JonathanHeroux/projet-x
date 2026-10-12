import { MdMoreHoriz } from "react-icons/md";
// Temporary trending topics data
const trendings = [
  {
    trendingIn: "Trending in Canada",
    title: "The Odyssey",
  },
  {
    trendingIn: "Trending in Canada",
    title: "World Series",
  },
  {
    trendingIn: "Trending in Canada",
    title: "Amber Alert",
  },
  {
    trendingIn: "Trending in Canada",
    title: "Tornado",
  },
];

export default function WhatsHappening() {
  return (
    <section className=" border border-neutral-800 py-3 rounded-2xl mt-4 overflow-hidden">
      {/* Section header */}
      <div className=" px-4 py-3">
        <h2 className="font-bold text-2xl">What's Happening</h2>
      </div>

      {/* Render trending topics */}
      <div className="flex flex-col min-w-0">
        {trendings.map((trendingItem) => {
          return (
            <article
              key={trendingItem.title}
              className="flex hover:bg-neutral-900 cursor-pointer transition-colors px-4 py-2"
            >
              {/* Trending category and title */}
              <div className="flex flex-1 text-left flex-col ">
                <p className="text-neutral-500">{trendingItem.trendingIn}</p>
                <p className="font-semibold">{trendingItem.title}</p>
              </div>
              <div className="flex items-center">
                <button
                  title="More"
                  className="cursor-pointer p-2 rounded-full transition-colors hover:bg-sky-700/10 duration-300 group"
                >
                  <MdMoreHoriz className="text-2xl transition-colors duration-200 group-hover:text-sky-500" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Display additional trending topics */}
      <button className="text-left w-full text-sky-500 px-4 py-3 hover:bg-neutral-900 transition-colors">
        Show more
      </button>
    </section>
  );
}
