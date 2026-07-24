import { RiSearchLine } from "react-icons/ri";
export default function SearchBar() {
  return (
    <form>
      {/* Label for assistance only */}
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      {/* Search Bar */}
      <div className="flex items-center gap-1 rounded-full border border-neutral-800 px-4 py-2.5 focus-within:border-sky-500">
        <RiSearchLine className=" text-neutral-500" />
        <input
          id="search"
          type="search"
          placeholder="Search"
          className="outline-none bg-transparent w-full "
        />
      </div>
    </form>
  );
}
