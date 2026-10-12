import { NavLink } from "react-router-dom";
import { navigation } from "./SidebarNav";
import SidebarUser from "./SidebarUser";

const mobileRoutes = ["/home", "/notifications", "/follow", "/profile"];

const disabledRoutes = ["/bookmarks", "/notifications"];

export default function MobileNav() {
  const mobileNavigation = mobileRoutes
    .map((route) => navigation.find((item) => item.to === route))
    .filter(Boolean);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex w-full items-center justify-around border-t border-neutral-800 bg-black py-3 md:hidden"
    >
      {mobileNavigation.map((navItem) => {
        const Icon = navItem.icon;

        if (disabledRoutes.includes(navItem.to)) {
          return (
            <button
              key={navItem.to}
              type="button"
              disabled
              aria-label={`${navItem.label} (coming soon)`}
              title={`${navItem.label} - Coming soon`}
              className="flex h-11 w-11 cursor-default items-center justify-center rounded-full text-neutral-600"
            >
              <Icon className="text-2xl" />
            </button>
          );
        }

        return (
          <NavLink
            key={navItem.to}
            to={navItem.to}
            aria-label={navItem.label}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-neutral-900"
          >
            {({ isActive }) => {
              const ActiveIcon =
                isActive && navItem.activeIcon
                  ? navItem.activeIcon
                  : navItem.icon;

              return <ActiveIcon className="text-2xl" />;
            }}
          </NavLink>
        );
      })}

      {/* Account menu and logout */}
      <div className="flex h-11 w-11 items-center justify-center">
        <SidebarUser mobile />
      </div>
    </nav>
  );
}
