import { useState } from "react";

export default function FaucetButton({ address }) {
  const [status, setStatus] = useState("");
  const FAUCET_ENDPOINT = "https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx";

  async function requestFunds() {
    if (!address) {
      setStatus("Generate a wallet first.");
      return;
    }
    setStatus("Requesting test STX from faucet...");

    try {
      // Stacks API accepts address as query param (GET) or POST with body depending on deployment.
      // Official Stacks faucet endpoint supports GET with ?address=...
      const url = `${FAUCET_ENDPOINT}?address=${encodeURIComponent(address)}`;
      const resp = await fetch(url, { method: "GET" });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        setStatus("Faucet error: " + (txt || resp.statusText));
        return;
      }
      const data = await resp.json().catch(() => ({}));
      // response often contains transaction_id
      if (data?.tx_id || data?.transaction_id || data?.txid) {
        setStatus("✅ Faucet request submitted. tx_id: " + (data.tx_id || data.transaction_id || data.txid));
      } else if (data?.error) {
        setStatus("Faucet error: " + data.error);
      } else {
        setStatus("✅ Faucet request sent. Check explorer for credits (may take a minute).");
      }
    } catch (err) {
      console.error("Faucet request failed", err);
      setStatus("Faucet request failed — try again later.");
    }
  }

  return (
    <div className="text-center mt-4">
      <button onClick={requestFunds} className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 font-semibold">
        💧 Request Testnet STX
      </button>
      {status && <p className="mt-3 text-sm text-gray-300 break-words">{status}</p>}
    </div>
  );
}
