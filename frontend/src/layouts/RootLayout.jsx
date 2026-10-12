import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import RightPanel from "../components/RightPanel/RightPanel";
import MobileNav from "../components/Sidebar/MobileNav";
import { useState } from "react";
import MobileSidebar from "../components/Sidebar/MobileSidebar";
import SidebarUser from "../components/Sidebar/SidebarUser";

export default function RootLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black pb-20 text-white md:pb-0">
      <div className="flex h-14 items-center justify-between border-b border-neutral-800 px-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="rounded-full"
          aria-label="Open navigation"
        >
          ☰
        </button>

        <span className="text-xl font-bold">𝕏</span>

        <div className="w-8" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="w-full min-w-0 flex-1 border-x border-neutral-800 md:w-auto">
          <Outlet />
        </main>

        <div className="hidden lg:block">
          <RightPanel />
        </div>
      </div>
      <MobileNav />
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </div>
  );
}
