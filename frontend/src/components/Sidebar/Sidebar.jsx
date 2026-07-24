import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarPostButton from "./SidebarPostButton";
import SidebarUser from "./SidebarUser";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-75 border-r border-neutral-800">
      <div className="flex h-full flex-col px-3">
        <SidebarLogo />
        <SidebarNav />
        <SidebarPostButton />
        <div className="mt-auto">
          <SidebarUser />
        </div>
      </div>
    </aside>
  );
}
