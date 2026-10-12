import { GoPlus } from "react-icons/go";

// Define the available feed tabs
const tabs = ["For you", "Following", "Tech"];

export default function HomeHeader({ activeTab, onTabChange }) {
  return (
    <div>
      {/* Feed tabs */}
      <div className="flex h-18 w-full min-w-0 text-base sm:text-xl text-neutral-500 border-b border-neutral-700">
        {/* Generate a navigation button for each available tab */}
        {tabs.map((tabItem) => {
          return (
            <button
              key={tabItem}
              className="relative flex min-w-0 flex-1 items-center justify-center transition-colors hover:bg-neutral-900"
              onClick={() => onTabChange(tabItem)}
            >
              <span
                className={
                  activeTab === tabItem
                    ? "font-semibold text-white"
                    : "text-neutral-500"
                }
              >
                {tabItem}
              </span>
              {/* Display the indicator only under the active tab */}
              {activeTab === tabItem && (
                <span className="absolute bottom-0 h-1 w-14 rounded-full bg-sky-500" />
              )}
            </button>
          );
        })}

        {/* Add a new feed tab */}
        <button className="flex h-10 w-10 shrink-0 self-center items-center justify-center rounded-full hover:bg-neutral-900 mr-1 sm:mr-2">
          <GoPlus className="text-3xl text-neutral-500" />
        </button>
      </div>
    </div>
  );
}
