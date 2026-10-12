import { NavLink } from "react-router-dom";
import { navigation } from "./SidebarNav";
import SidebarUser from "./SidebarUser";

export default function MobileSidebar({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-[60] md:hidden ${
        isOpen ? "visible" : "invisible delay-300"
      }`}
    >
      {/* Dark overlay */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`absolute inset-0 w-full bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Left navigation panel */}
      <aside
        className={`absolute inset-y-0 left-0 flex w-[80%] max-w-80 flex-col bg-black shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Account */}
        <div className="border-b border-neutral-800 p-4">
          <SidebarUser />
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-5 rounded-full px-4 py-3 hover:bg-neutral-900"
            >
              {({ isActive }) => {
                const Icon =
                  isActive && item.activeIcon ? item.activeIcon : item.icon;

                return (
                  <>
                    <Icon className="shrink-0 text-2xl" />
                    <span className="text-xl font-semibold">{item.label}</span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
