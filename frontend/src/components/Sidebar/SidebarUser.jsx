import { MdMoreHoriz } from "react-icons/md";

export default function SidebarUser() {
  return (
    <button className=" flex rounded-full items-center w-full mb-7 py-2 hover:bg-neutral-800 p-3">
      <div className="flex flex-1 items-center min-w-0">
        <img
          src="/x_default_profile_picture.jpg"
          className="rounded-full w-11 h-11 shrink-0"
        />
        <div className="flex flex-1 text-left flex-col min-w-0 px-2 ">
          <div className="  font-bold truncate">Jonathan Heroux</div>
          <div className=" truncate text-neutral-500">@JonathanHeroux</div>
        </div>
      </div>
      <div className=" flex items-center pl-3">
        <MdMoreHoriz className="text-2xl" />
      </div>
    </button>
  );
}
