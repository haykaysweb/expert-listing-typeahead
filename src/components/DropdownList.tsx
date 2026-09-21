
import { AlertCircle } from "lucide-react";

export interface DropdownItem {
  id: string;
  primaryText: string;
  secondaryText?: string;
}

interface DropdownListProps<T extends DropdownItem> {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  items: T[];
  selectedIndex: number;
  query: string;
  onSelect: (item: T) => void;
  onHover: (index: number) => void;
}

export function DropdownList<T extends DropdownItem>({
  isOpen,
  loading,
  error,
  items,
  selectedIndex,
  query,
  onSelect,
  onHover,
}: DropdownListProps<T>) {
  if (!isOpen || !query.trim()) return null;

  return (
    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {loading && items.length === 0 && (
        <li className="px-4 py-3 text-sm text-gray-500">Searching...</li>
      )}
      {error && (
        <li className="px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </li>
      )}
      {!loading && !error && items.length === 0 && (
        <li className="px-4 py-3 text-sm text-gray-500">
          No results found for "{query}"
        </li>
      )}
      {items.map((item, idx) => (
        <li
          key={item.id}
          onClick={() => onSelect(item)}
          onMouseEnter={() => onHover(idx)}
          className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
            idx === selectedIndex
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="font-medium truncate">{item.primaryText}</span>
          {item.secondaryText && (
            <span className="text-xs text-gray-400 ml-2 shrink-0">
              {item.secondaryText}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
