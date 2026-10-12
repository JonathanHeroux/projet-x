import { NavLink } from "react-router-dom";
import { GrValidate } from "react-icons/gr";
import { RiGrokAiLine } from "react-icons/ri";
import { IoChatbubbleOutline, IoChatbubbleSharp } from "react-icons/io5";
import { GoHome, GoHomeFill } from "react-icons/go";
import { RiNotification2Line, RiNotification2Fill } from "react-icons/ri";
import { HiUserAdd, HiOutlineUserAdd } from "react-icons/hi";
import { CgMoreO } from "react-icons/cg";
import { PiRocketLaunch, PiRocketLaunchFill } from "react-icons/pi";
import { IoBookmarkOutline, IoBookmarkSharp } from "react-icons/io5";
import { IoPersonOutline, IoPerson } from "react-icons/io5";
import { IoSearchOutline, IoSearchSharp } from "react-icons/io5";

export const navigation = [
  {
    label: "Home",
    to: "/home",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Explore",
    to: "/explore",
    icon: IoSearchOutline,
    activeIcon: IoSearchSharp,
    disabled: true,
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: RiNotification2Line,
    activeIcon: RiNotification2Fill,
    disabled: true,
  },
  {
    label: "Follow",
    to: "/follow",
    icon: HiOutlineUserAdd,
    activeIcon: HiUserAdd,
  },
  {
    label: "Chat",
    to: "/chat",
    icon: IoChatbubbleOutline,
    activeIcon: IoChatbubbleSharp,
    disabled: true,
  },
  {
    label: "Grok",
    to: "/grok",
    icon: RiGrokAiLine,
    disabled: true,
  },
  {
    label: "Bookmarks",
    to: "/bookmarks",
    icon: IoBookmarkOutline,
    activeIcon: IoBookmarkSharp,
    disabled: true,
  },
  {
    label: "Creator Studio",
    to: "/creator_studio",
    icon: PiRocketLaunch,
    activeIcon: PiRocketLaunchFill,
    disabled: true,
  },
  {
    label: "Premium",
    to: "/premium",
    icon: GrValidate,
    disabled: true,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: IoPersonOutline,
    activeIcon: IoPerson,
  },
  {
    label: "More",
    to: "/more",
    icon: CgMoreO,
    disabled: true,
  },
];

export default function SidebarNav() {
  return (
    <nav className="flex flex-col gap-4 mt-2 items-start">
      {navigation.map((navItem) => {
        const Icon = navItem.icon;

        // Keep unfinished features visible without navigation
        if (navItem.disabled) {
          return (
            <button
              key={navItem.to}
              type="button"
              title="Coming soon"
              className="flex items-center gap-4 rounded-full pl-4 pr-8 py-3 hover:bg-neutral-900 transition-colors duration-200 cursor-default"
            >
              <Icon className="text-3xl" />
              <span className="text-2xl">{navItem.label}</span>
            </button>
          );
        }

        // Navigate only to implemented pages
        return (
          <NavLink
            className="flex items-center gap-4 rounded-full pl-4 pr-8 py-3 hover:bg-neutral-900 transition-colors duration-200"
            key={navItem.to}
            to={navItem.to}
          >
            {({ isActive }) => {
              const ActiveIcon =
                isActive && navItem.activeIcon
                  ? navItem.activeIcon
                  : navItem.icon;

              return (
                <>
                  <ActiveIcon className="text-3xl" />
                  <span className="text-2xl">{navItem.label}</span>
                </>
              );
            }}
          </NavLink>
        );
      })}
    </nav>
  );
}
