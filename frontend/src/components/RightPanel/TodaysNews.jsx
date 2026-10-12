import { IoClose } from "react-icons/io5";
// Temporary news data displayed in the right panel
const news = [
  {
    title: "Jennie's Cozy Instagram Story Sparks Mystery Man Theories",
    meta: "4 hours ago · Entertainment · 9,572 posts",
    images: [
      "/x_default_profile_picture.jpg",
      "/x_default_profile_picture.jpg",
      "/x_default_profile_picture.jpg",
    ],
  },
  {
    title: "Behind-the-Scenes Photos Reveal Nolan's Massive Cyclops Puppet",
    meta: "4 hours ago · Entertainment · 4,022 posts",
    images: [
      "/x_default_profile_picture.jpg",
      "/x_default_profile_picture.jpg",
      "/x_default_profile_picture.jpg",
    ],
  },
  {
    title: "Meme Compares Nolan's Diverse Odyssey to Gibson's Apocalypto",
    meta: "4 hours ago · Entertainment · 2,524 posts",
    images: [
      "/x_default_profile_picture.jpg",
      "/x_default_profile_picture.jpg",
      "/x_default_profile_picture.jpg",
    ],
  },
];
export default function TodaysNews() {
  return (
    <section className="border border-neutral-800 py-3 rounded-2xl mt-4 overflow-hidden">
      {/* Section header and close button */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-2xl font-bold">Today's News</h2>
        <button className="rounded-full p-2 transition-colors hover:bg-neutral-900">
          <IoClose className="text-xl " />
        </button>
      </div>
      <div>
        {/* Render each news article */}
        {news.map((newsItem) => {
          return (
            <article
              key={newsItem.title}
              className="cursor-pointer px-4 py-3 transition-colors hover:bg-neutral-900"
            >
              <p className="font-bold leading-tight">{newsItem.title}</p>
              <div className="flex items-center">
                {/* Display overlapping profile images */}
                <div className="flex -space-x-2 pr-2">
                  {newsItem.images.map((image) => {
                    return (
                      <img
                        key={image}
                        src={image}
                        className="h-5 w-5 rounded-full"
                      />
                    );
                  })}
                </div>
                <p className="mt-1 text-sm text-neutral-500">{newsItem.meta}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
