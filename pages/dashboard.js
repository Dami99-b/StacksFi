import StackFiLogo from "../components/StackFiLogo";
import WalletGenerator from "../components/WalletGenerator";
import AIAssistant from "../components/AIAssistant";
import NewsFeed from "../components/NewsFeed";

export default function Dashboard() {
  return (
    <div className="min-h-screen px-6 py-10">
      <header className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StackFiLogo size={56} />
          <div>
            <h1 className="text-2xl font-bold">StackFi</h1>
            <p className="text-sm text-gray-400">AI DeFi tools on Stacks — built by Dami</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">Testnet mode</div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <WalletGenerator />
          <AIAssistant />
        </div>

        <aside>
          <NewsFeed />
          <div className="card mt-6">
            <h3 className="text-xl font-bold">About StackFi</h3>
            <p className="text-gray-300 mt-2">StackFi helps experimenters and developers prototype Stacks DeFi flows with instant wallet generation and faucet top-ups for testnet. For the hackathon — show transactions, UX, and integration with sBTC workflows.</p>
          </div>
        </aside>
      </main>

      <footer className="max-w-5xl mx-auto mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} StackFi — built by Dami
      </footer>
    </div>
  );
}
