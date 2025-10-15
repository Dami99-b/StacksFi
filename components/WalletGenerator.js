import { useState } from "react";
import FaucetButton from "./FaucetButton";

// Try real stacks SDK, but if it errors we fallback to mock
let stacksGenerateWallet;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  // dynamic require so build won't fail hard if SDK mismatch
  // This will succeed when @stacks/wallet-sdk is present and supports generateWallet
  // (some versions export differently — we catch errors)
  // eslint-disable-next-line global-require
  const sdk = require("@stacks/wallet-sdk");
  stacksGenerateWallet = sdk?.generateWallet || sdk?.wallet?.generateWallet || sdk?.generate;
} catch (e) {
  stacksGenerateWallet = null;
}

function makeMockWallet() {
  const rnd = () => Math.random().toString(36).slice(2, 12).toUpperCase();
  // create a plausible testnet-ish address prefix for demo (not valid onchain)
  const address = `STX_TEST_${rnd()}`;
  const publicKey = `PUB_${rnd()}`;
  const privateKey = `PRIV_${rnd()}${rnd()}`;
  return { address, publicKey, privateKey, isMock: true };
}

export default function WalletGenerator() {
  const [acct, setAcct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function createWallet() {
    setLoading(true);
    setErrorMsg("");
    try {
      if (stacksGenerateWallet) {
        try {
          // attempt real wallet creation using SDK
          const password = "stackfi_demo_" + Math.random().toString(36).slice(2,8);
          const w = await stacksGenerateWallet({ secretKey: undefined, password });
          // normalize various shapes
          let a = null;
          if (w?.accounts && w.accounts.length) a = w.accounts[0];
          else a = w;
          // common fields
          const address = a?.stxAddress || a?.address || a?.addressHash || a?.addressString || a?.address;
          const publicKey = a?.stxPublicKey || a?.publicKey || a?.pubKey || "";
          // secretKey may be in wallet root
          const secretKey = w?.secretKey || a?.secretKey || "";
          if (!address) throw new Error("No address found in SDK response");
          setAcct({ address, publicKey, secretKey, isMock: false, raw: w });
          setLoading(false);
          return;
        } catch (err) {
          console.warn("Real wallet generation failed, falling back to mock:", err);
          // fallthrough to mock creation below
        }
      }

      // fallback: create a mock wallet object so app keeps working
      const mock = makeMockWallet();
      setAcct(mock);
    } catch (err) {
      console.error("createWallet error", err);
      setErrorMsg("Wallet generation failed.");
    } finally {
      setLoading(false);
    }
  }

  // simple simulated send TX for demo when using mock wallet
  async function simulateSend(to, amount) {
    const txid = "SIM_TX_" + Math.random().toString(36).slice(2,9);
    return { ok: true, txid, to, amount };
  }

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-3">Wallet Generator (Stacks testnet)</h3>

      {!acct ? (
        <>
          <p className="text-gray-300 mb-4">Create a test/demo wallet. If the real SDK fails, a mock wallet is created so the demo always works.</p>
          <div className="flex gap-3">
            <button
              onClick={createWallet}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 font-semibold"
            >
              {loading ? "Generating..." : "Generate Wallet"}
            </button>
            <button
              onClick={() => {
                // quick mock generate
                setAcct(makeMockWallet());
              }}
              className="px-4 py-3 rounded-xl border border-gray-700 text-gray-300"
            >
              Quick Mock
            </button>
          </div>
          {errorMsg && <p className="text-red-400 mt-3">{errorMsg}</p>}
        </>
      ) : (
        <>
          <div className="text-sm text-gray-300">
            <div><strong>Address:</strong></div>
            <div className="break-words font-mono text-green-300">{acct.address}</div>
            <div className="mt-2 text-xs text-gray-500">Public key (trunc): {String(acct.publicKey || "").slice(0,24)}</div>
            <div className="mt-3">
              <FaucetButton address={acct.address} isMock={acct.isMock} />
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Quick Tx (demo)</h4>
              <SendForm acct={acct} simulateSend={simulateSend} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SendForm({ acct, simulateSend }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [status, setStatus] = useState("");

  async function doSend() {
    setStatus("Sending...");
    try {
      // If this is mock, simulate; otherwise you could call a backend to sign + broadcast
      if (acct.isMock) {
        const res = await simulateSend(to || "STX_TEST_RECIPIENT", amount);
        setStatus(`Simulated tx sent — txid: ${res.txid}`);
      } else {
        // For a real wallet you'd implement signing + broadcasting via backend or Stacks SDK
        setStatus("Real wallet detected — to send you need server signing or wallet connect integration.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Send failed.");
    }
  }

  return (
    <div className="mt-2 space-y-2">
      <input value={to} onChange={(e)=>setTo(e.target.value)} placeholder="Recipient address" className="w-full p-2 rounded-md bg-[#0b0b12] text-white text-sm" />
      <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount (STX)" className="w-full p-2 rounded-md bg-[#0b0b12] text-white text-sm" />
      <div className="flex gap-2">
        <button onClick={doSend} className="px-4 py-2 rounded-md bg-blue-600 font-semibold">Send</button>
        <button onClick={()=>{ setTo(""); setAmount("0.01"); setStatus(""); }} className="px-4 py-2 rounded-md border border-gray-700 text-gray-300">Clear</button>
      </div>
      {status && <div className="text-sm text-gray-300 mt-2">{status}</div>}
    </div>
  );
}
