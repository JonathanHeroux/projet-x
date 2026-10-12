import { MdMoreHoriz } from "react-icons/md";
import { Link } from "react-router-dom";

// Define the navigation links displayed in the footer
const footerLinks = [
  {
    label: "Terms",
    to: "/Terms",
  },
  {
    label: "Privacy",
    to: "/Privacy",
  },
  {
    label: "Cookies",
    to: "/Cookies",
  },
  {
    label: "Accessibility",
    to: "/Accessibility",
  },
  {
    label: "Ads info",
    to: "/Ads&Business",
  },
];

export default function Footer() {
  return (
    <>
      {/* Footer separator */}
      <div className="flex justify-center">
        <div className="mt-10 h-px bg-neutral-700 w-80" />
      </div>
      <div className="px-3">
        <nav className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
          {/* Render the footer navigation links */}
          {footerLinks.map((footerItem) => {
            return (
              <div key={footerItem.to} className="flex items-center gap-2">
                <Link
                  to={footerItem.to}
                  className="transition-colors hover:underline"
                >
                  {footerItem.label}
                </Link>

                <span>·</span>
              </div>
            );
          })}

          {/* Additional navigation options */}
          <Link
            to="/more"
            className="flex items-center transition-colors hover:underline"
          >
            More
            <MdMoreHoriz />
          </Link>

          <span>·</span>

          {/* Display the current year automatically */}
          <p>© {new Date().getFullYear()} X Corp.</p>
        </nav>
      </div>
    </>
  );
}
