import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loading: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  loading,
  placeholder = 'Search...',
  inputRef,
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-900 shadow-sm"
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
      {loading && (
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin absolute right-3 top-3.5 pointer-events-none" />
      )}
    </div>
  );
}