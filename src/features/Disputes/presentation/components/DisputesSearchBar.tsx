import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/input";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function DisputesSearchBar({ search, setSearch }: Props) {
  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

        <Input
          value={search}
          size="lg"
          onChange={(value) => setSearch(value)}
          placeholder="Search disputes..."
          className="
            h-11 w-full
            rounded-xl
            bg-gray-100
            border border-gray-200
            pl-11 pr-4
            text-sm
            placeholder:text-gray-400
            transition-all
            duration-300
            focus:bg-gray-50
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />
      </div>
    </div>
  );
}