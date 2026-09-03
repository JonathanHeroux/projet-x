import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import RightPanel from "../components/RightPanel/RightPanel";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar />

        <main className="min-w-0 flex-1 border-r border-neutral-800">
          <Outlet />
        </main>

        <RightPanel />
      </div>
    </div>
  );
}
