import { useState } from "react";
import { GoPlus } from "react-icons/go";

const tabs = ["For you", "Following", "Tech"];

export default function HomeHeader() {
  const [activeTab, setActiveTab] = useState("For you");
  return (
    <div className="flex h-18 flex-1 text-xl text-neutral-500 border-b border-neutral-700">
      {tabs.map((tabItem) => {
        return (
          <button
            key={tabItem}
            className="flex flex-1 items-center justify-center transition-colors hover:bg-neutral-900 relative"
            onClick={() => setActiveTab(tabItem)}
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
            {activeTab === tabItem && (
              <span className="absolute bottom-0 h-1 w-14 rounded-full bg-sky-500" />
            )}
          </button>
        );
      })}

      <button className="flex w-10 h-10 self-center items-center justify-center rounded-full hover:bg-neutral-900 mr-2">
        <GoPlus className="text-3xl text-neutral-500" />
      </button>
    </div>
  );
}
