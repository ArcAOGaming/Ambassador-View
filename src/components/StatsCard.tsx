import React from "react";
import { formatAmountFromBaseUnits, formatNumber } from "../utils/format";

interface Props {
  totalBaseUnits: bigint;
  tokenSymbol?: string;
  count: number;
}

const StatsCard: React.FC<Props> = ({ totalBaseUnits, tokenSymbol = "Botega LP GAME/AO", count }) => {
  const total = formatAmountFromBaseUnits(totalBaseUnits.toString());
  return (
    <div className="card stats">
      <div className="stat">
        <div className="stat-label">Total Earnings ({tokenSymbol})</div>
        <div className="stat-value">{total}</div>
      </div>
      <div className="stat">
        <div className="stat-label">Payouts</div>
        <div className="stat-value">{formatNumber(count)}</div>
      </div>
    </div>
  );
};

export default StatsCard;
