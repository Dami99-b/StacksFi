import { useEffect, useState } from "react";

export default function NewsFeed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // CoinStats public news endpoint (no key) — fallback if blocked
    fetch("https://api.coinstats.app/public/v1/news?skip=0&limit=6")
      .then(r => r.json())
      .then(d => setItems(d.news || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="card mt-8">
      <h3 className="text-2xl font-bold mb-3">DeFi & Bitcoin News</h3>
      {items.length === 0 ? (
        <p className="text-gray-400">Loading headlines...</p>
      ) : (
        <ul className="space-y-3">
          {items.map((n,i) => (
            <li key={i}>
              <a href={n.link} target="_blank" rel="noreferrer" className="text-pink-400 font-medium hover:underline">
                {n.title}
              </a>
              <div className="text-xs text-gray-500">{n.source}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
