// DisputesSearchBar.tsx
import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/input";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function DisputesSearchBar({ search, setSearch }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm px-3 sm:px-5 py-3 border-b border-gray-100">
      <div className="relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-6 w-6 text-black" />

        <Input
          value={search}
          size="lg"
          onChange={(value) => setSearch(value)}
          placeholder="Search disputes..."
          className="
            h-10 sm:h-11 w-full
            rounded-xl
            bg-white
            border border-gray-200
            pl-10 pr-4
            text-sm
            placeholder:text-gray-400
            transition-all
            duration-300
            focus:bg-white
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
            focus:outline-none
          "
        />
      </div>
    </div>
  );
}