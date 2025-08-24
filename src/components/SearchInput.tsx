import * as React from "react";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number; // default 300ms
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
}) => {
  const [internalValue, setInternalValue] = React.useState(value);

  // keep internal input in sync with prop
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // debounce
  React.useEffect(() => {
    const id = setTimeout(() => onChange(internalValue.trim()), debounce);
    return () => clearTimeout(id);
  }, [internalValue, debounce, onChange]);

  return (
    <div className="relative w-full">
      {/* Left search icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      <Input
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label="Search"
      />

      {/* Clear button */}
      {internalValue.length > 0 && (
        <button
          type="button"
          onClick={() => setInternalValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-muted"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};
