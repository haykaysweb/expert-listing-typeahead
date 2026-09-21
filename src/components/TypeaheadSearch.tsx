import React, { useState, useEffect, useRef } from 'react';
import { SearchInput } from './SearchInput';
import { DropdownList } from './DropdownList';
import type { DropdownItem } from './DropdownList';

interface GeoLocationItem {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
}

interface GeoApiResponse {
  results?: GeoLocationItem[];
}

interface LocationDropdownItem extends DropdownItem {
  rawId: number;
}

export function TypeaheadSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<LocationDropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            debouncedQuery
          )}&count=8&language=en&format=json`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: GeoApiResponse = await res.json();
        if (isMounted) {
          const items = data.results || [];
          const formatted: LocationDropdownItem[] = items.map((loc) => ({
            id: String(loc.id),
            rawId: loc.id,
            primaryText: loc.name,
            secondaryText: [loc.admin1, loc.country].filter(Boolean).join(', '),
          }));
          setResults(formatted);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Fetch error:', err);
          setError('Could not fetch results. Please try again.');
          setResults([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (item: LocationDropdownItem) => {
    const fullText = item.secondaryText
      ? `${item.primaryText}, ${item.secondaryText}`
      : item.primaryText;
    setQuery(fullText);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <SearchInput
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        loading={loading}
        placeholder="Search city/location (e.g. Lagos, )..."
      />
      <DropdownList
        isOpen={isOpen}
        loading={loading}
        error={error}
        items={results}
        selectedIndex={selectedIndex}
        query={debouncedQuery}
        onSelect={handleSelect}
        onHover={(idx) => setSelectedIndex(idx)}
      />
    </div>
  );
}