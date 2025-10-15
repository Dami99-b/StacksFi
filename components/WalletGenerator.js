import { useState } from "react";
import { generateWallet as stacksGenerateWallet } from "@stacks/wallet-sdk";
import FaucetButton from "./FaucetButton";

export default function WalletGenerator() {
  const [acct, setAcct] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createWallet() {
    setLoading(true);
    try {
      // generate a simple wallet (test/demo)
      // stacksGenerateWallet returns wallet object with accounts array
      const password = "stackfi-demo-" + Math.random().toString(36).slice(2,8);
      const w = await stacksGenerateWallet({ secretKey: undefined, password });
      // account object shape differs by SDK version; normalize:
      const a = w?.accounts?.[0] || w;
      // try common fields
      const address = a?.stxAddress || a?.address || a?.addressHash || a?.addressString;
      const publicKey = a?.stxPublicKey || a?.publicKey || a?.pubKey;
      setAcct({
        address: address || String(a?.address || a?.stxAddress || ""),
        publicKey: publicKey || "",
        raw: a
      });
      // store seed in localStorage for persistence (encrypted approach would be better)
      if (w?.secretKey) localStorage.setItem("stackfi_seed", w.secretKey);
    } catch (err) {
      console.error("createWallet error", err);
      alert("Wallet generation failed — check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-3">Wallet Generator (Stacks testnet)</h3>

      {!acct ? (
        <>
          <p className="text-gray-300 mb-4">Create a temporary testnet wallet stored locally on your device.</p>
          <button
            onClick={createWallet}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 font-semibold"
          >
            {loading ? "Generating..." : "Generate Wallet"}
          </button>
        </>
      ) : (
        <>
          <p className="text-green-300 font-mono break-words">{acct.address}</p>
          <p className="text-sm text-gray-400 mt-2">Public key (truncated): {acct.publicKey?.slice(0,24) || "—"}</p>

          <div className="mt-4">
            <FaucetButton address={acct.address} />
          </div>
        </>
      )}
    </div>
  );
}
