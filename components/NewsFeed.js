import { useEffect, useState } from "react";

export default function NewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // We'll try CryptoRank first (requires API key), otherwise fallback to CoinGecko
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      // Try CryptoRank
      try {
        const key = process?.env?.NEXT_PUBLIC_CRYPTORANK_KEY || process.env.NEXT_PUBLIC_CRYPTORANK_KEY;
        if (key) {
          const r = await fetch(`https://api.cryptorank.io/v0/news?limit=6`, {
            headers: { Authorization: `Bearer ${key}` }
          });
          if (r.ok) {
            const d = await r.json();
            const mapped = (d?.data || []).slice(0,6).map(n => ({
              title: n.title,
              link: n.url,
              source: n.source || n.domain || "CryptoRank"
            }));
            if (mounted && mapped.length) { setItems(mapped); setLoading(false); return; }
          }
        }
      } catch (err) {
        console.warn("CryptoRank failed", err);
      }

      // Fallback: CoinGecko -> craft headlines from top coins (no API key)
      try {
        const r2 = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false");
        if (r2.ok) {
          const d2 = await r2.json();
          const mapped = (d2 || []).map(c => ({
            title: `${c.name} price: $${Number(c.current_price).toFixed(2)} (${c.price_change_percentage_24h?.toFixed(2)}%)`,
            link: `https://www.coingecko.com/en/coins/${c.id}`,
            source: "CoinGecko"
          }));
          if (mounted) setItems(mapped);
        } else {
          if (mounted) setItems([]);
        }
      } catch (err) {
        console.error("CoinGecko fetch failed", err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="card mt-8">
      <h3 className="text-2xl font-bold mb-3">DeFi & Bitcoin News</h3>
      {loading ? (
        <p className="text-gray-400">Loading headlines...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">No headlines available right now.</p>
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
