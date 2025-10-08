import "./App.css";
import "./components/components.css";
import ConnectButton from "./ConnectButton";
import StatsCard from "./components/StatsCard";
import Sparkline from "./components/Sparkline";
import PayoutList from "./components/PayoutList";
import ReferralLink from "./components/ReferralLink";
import { useCreditNotices } from "./hooks/useCreditNotices";
import { useActiveAddress } from "@arweave-wallet-kit/react";

function App() {
  const address = useActiveAddress();
  const { loading, error, items, totals, weekly } = useCreditNotices(
    address ?? undefined
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-left-content">
              <img
                src="/arcao-logo.png"
                alt="Ambassadors"
                className="header-logo"
              />
              <h1 className="header-title">Ambassadors</h1>
            </div>
            <p className="header-subtitle">Track your earnings and referrals</p>
          </div>
          <div className="header-right">
            {address && <ReferralLink address={address} compact={true} />}
            <ConnectButton />
          </div>
        </div>
      </header>

      {!address && (
        <div className="card empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">🔐</div>
            <div className="empty-state-text">
              Please connect your wallet to view your stats
            </div>
          </div>
        </div>
      )}

      {address && (
        <>
          <StatsCard
            totalBaseUnits={totals.totalBaseUnits}
            count={items.length}
            tokenSymbol="Botega LP GAME/AO"
          />
          <Sparkline data={weekly} />
          <PayoutList items={items} tokenSymbol="Botega LP GAME/AO" />
        </>
      )}

      {loading && (
        <div
          className="card"
          style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <div style={{ display: "inline-block" }}>⏳ Loading payouts…</div>
        </div>
      )}
      {error && (
        <div
          className="card"
          style={{
            textAlign: "center",
            color: "#ff6b6b",
            borderColor: "rgba(255, 107, 107, 0.3)",
          }}
        >
          ⚠️ Error: {error}
        </div>
      )}
    </div>
  );
}

export default App;
