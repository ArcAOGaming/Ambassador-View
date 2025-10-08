import React from "react";
import type { CreditNotice } from "../hooks/useCreditNotices";
import { formatAmountFromBaseUnits, formatDateShort } from "../utils/format";

interface Props {
  items: CreditNotice[];
  tokenSymbol?: string;
}

const PayoutList: React.FC<Props> = ({ items, tokenSymbol = "AO" }) => {
  return (
    <div className="card">
      <div className="payout-list-title">💰 Latest Payouts ({tokenSymbol})</div>
      {items.length === 0 ? (
        <div className="payout-empty">No payouts yet.</div>
      ) : (
        <ul className="payout-list">
          {items.map((it) => (
            <li onClick={() => window.open(`https://www.ao.link/#/message/${it.id}`, '_blank')} key={it.id} className="payout-item">
              <div>
                <div className="payout-amount">
                  {formatAmountFromBaseUnits(it.quantity)}
                </div>
                <div className="payout-source">
                  {it.fromProcess ? `From ${it.sender}` : it.fromProcess}
                </div>
              </div>
              <div className="payout-date">
                {formatDateShort((it.blockTimeStamp || 0) * 1000)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PayoutList;
