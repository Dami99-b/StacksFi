import { useState } from "react";

export default function FaucetButton({ address, isMock = false }) {
  const [status, setStatus] = useState("");
  const FAUCET_ENDPOINT = "https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx";

  async function requestFunds() {
    if (!address) {
      setStatus("Generate a wallet first.");
      return;
    }
    setStatus("Requesting test STX...");

    try {
      // If we have a mock wallet, simulate success but still try real faucet
      const url = `${FAUCET_ENDPOINT}?address=${encodeURIComponent(address)}`;
      const resp = await fetch(url, { method: "GET" });
      if (resp.ok) {
        const data = await resp.json().catch(() => ({}));
        if (data?.tx_id || data?.transaction_id) {
          setStatus(`✅ Faucet submitted. tx: ${data.tx_id || data.transaction_id}`);
        } else {
          setStatus("✅ Faucet request sent — may take a minute.");
        }
        return;
      }

      // If faucet returns non-ok, fallback to mock success for demo
      const text = await resp.text().catch(() => "");
      console.warn("Faucet non-ok:", resp.status, text);
      setStatus("⚠️ Faucet endpoint error — simulating faucet success for demo.");
      // simulated tx id
      setTimeout(() => setStatus("✅ (Simulated) Faucet credited — tx: SIM_TX_" + Math.random().toString(36).slice(2,9)), 800);
    } catch (err) {
      console.error("Faucet request failed:", err);
      // fallback simulated success (demo mode)
      setStatus("⚠️ Faucet request failed — using simulated faucet for demo.");
      setTimeout(() => setStatus("✅ (Simulated) Faucet credited — tx: SIM_TX_" + Math.random().toString(36).slice(2,9)), 900);
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
