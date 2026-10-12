import { MdMoreHoriz } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";

export default function SidebarUser({ mobile = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Retrieve the authenticated user from the PHP session
  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await apiFetch("/me");

        if (!response.ok) {
          throw new Error("Unable to retrieve current user.");
        }

        const data = await response.json();

        if (!cancelled) {
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Current user fetch error:", error);
      }
    }

    loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // Synchronize the account avatar after a profile update
  useEffect(() => {
    function handleAvatarUpdated(event) {
      setCurrentUser((previousUser) =>
        previousUser
          ? { ...previousUser, avatar: event.detail.avatar }
          : previousUser,
      );
    }

    window.addEventListener("avatar-updated", handleAvatarUpdated);

    return () => {
      window.removeEventListener("avatar-updated", handleAvatarUpdated);
    };
  }, []);

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // End the PHP session before redirecting to login
  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await apiFetch("/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to log out");
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <div ref={menuRef} className={mobile ? "relative" : "relative w-full"}>
      {/* Account menu */}
      {isMenuOpen && (
        <div
          className={`absolute bottom-full z-50 mb-3 w-64 rounded-2xl bg-neutral-900 shadow-[0_0_15px_rgba(255,255,255,0.15)] ${
            mobile ? "right-0" : "left-0"
          }`}
        >
          <div className="py-3">
            <button
              type="button"
              className="w-full text-left px-4 py-3 font-bold hover:bg-neutral-800 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Add an existing account
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-3 font-bold hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut
                ? "Logging out..."
                : `Log out @${currentUser?.username ?? ""}`}
            </button>
          </div>

          {/* Menu pointer */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 rotate-45 bg-neutral-900"></div>
        </div>
      )}

      {/* Sidebar profile button */}
      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label="Account menu"
        className={
          mobile
            ? "flex items-center justify-center rounded-full p-1 hover:bg-neutral-800"
            : "flex rounded-full items-center w-full mb-7 py-2 hover:bg-neutral-800 p-3"
        }
      >
        <div className="flex flex-1 items-center min-w-0">
          <img
            src={currentUser?.avatar || "/x_default_profile_picture.jpg"}
            alt={currentUser?.name || "Profile avatar"}
            className="rounded-full w-11 h-11 shrink-0"
          />
          <div
            className={`flex flex-1 text-left flex-col min-w-0 px-2 ${mobile ? "hidden" : ""}`}
          >
            <div className="font-bold truncate">
              {currentUser?.name || "Loading..."}
            </div>
            <div className="truncate text-neutral-500">
              {currentUser?.username ? `@${currentUser.username}` : ""}
            </div>
          </div>
        </div>
        <div className={`flex items-center pl-3 ${mobile ? "hidden" : ""}`}>
          <MdMoreHoriz className="text-2xl" />
        </div>
      </button>
    </div>
  );
}
