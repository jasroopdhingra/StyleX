import { useState } from "react";

export function App() {
  const [query, setQuery] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3001/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await res.json();
    setLinks(data.links);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">StyleX Clothing Search Agent</h1>

      <input
        className="border p-2 w-full"
        placeholder="e.g. black satin midi dress under $80"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className="mt-4 p-2 bg-black text-white rounded"
        onClick={search}
      >
        Search
      </button>

      {loading && <p>Searching...</p>}

      <ul className="mt-6 space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <a href={link} target="_blank" className="text-blue-500 underline">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
