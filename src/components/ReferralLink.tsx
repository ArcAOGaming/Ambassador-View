import React, { useMemo, useState } from "react";
import { REF_BASE_URL } from "../config";

interface Props {
  address?: string | null;
  compact?: boolean;
}

const ReferralLink: React.FC<Props> = ({ address, compact = false }) => {
  const link = useMemo(() => {
    if (!REF_BASE_URL || !address) return "";
    const base = REF_BASE_URL.replace(/\/$/, "");
    return `${base}${address}`;
  }, [address]);

  const [copied, setCopied] = useState(false);

  if (!address) return null;

  if (compact) {
    return (
      <div className="referral-compact">
        <button
          className={`referral-compact-button ${copied ? "copied" : ""}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            } catch {
              /* empty */
            }
          }}
          disabled={!link}
          title={link}
        >
          {copied ? "✓ Copied!" : "🔗 Copy Referral"}
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="referral-container">
        <div className="referral-content">
          <div className="referral-label">🔗 Your referral link</div>
          <div className="referral-row">
            <div className="referral-link">{link}</div>
            <button
              className={`copy-button ${copied ? "copied" : ""}`}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                } catch {
                  /* empty */
                  console.error("Error copying referral link");
                }
              }}
              disabled={!link}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLink;
