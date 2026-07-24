import { Link } from "react-router-dom";
import Logo from "../Logo/Logo2";

export default function SidebarLogo() {
  return (
    <Link
      to="/home"
      className="h-14 w-14 inline-flex items-center justify-center rounded-full hover:bg-neutral-800 mt-2"
    >
      <Logo className="w-10" />
    </Link>
  );
}
