import { TypeaheadSearch } from "./components/TypeaheadSearch";

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Country Explorer Search
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Typeahead autocomplete with debouncing, race condition management, and
          keyboard controls.
        </p>
        <TypeaheadSearch />
      </div>
    </main>
  );
}
