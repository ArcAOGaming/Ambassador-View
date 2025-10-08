import { useEffect, useMemo, useState } from "react";
import { SPLITTER_PROCESS_ID, POOL_PROCESS_ID } from "../config";
import { startOfISOWeek } from "../utils/format";
import { ReactiveCreditNoticeService } from "ao-js-sdk";

export type CreditNotice = {
  id: string;
  sender: string;
  recipient: string;
  fromProcess?: string;
  quantity: string; // base units
  blockTimeStamp?: number; // seconds
};

export type WeeklyPoint = { weekStartMs: number; amountBaseUnits: bigint };
export function useCreditNotices(recipient?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CreditNotice[]>([]);

  useEffect(() => {
    if (!recipient) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    const svc = ReactiveCreditNoticeService.autoConfiguration();
    const obs = svc.streamAllCreditNoticesReceivedById$({
      recipient,
      tags: [
        {
          name: "From-Process",
          value: POOL_PROCESS_ID!,
        },
        {
          name: "Sender",
          value: SPLITTER_PROCESS_ID!,
        },
      ],
    });
    const sub = obs.subscribe({
      next: (batch: CreditNotice[]) => {
        setItems((prev) => {
          const map = new Map<string, CreditNotice>();
          for (const it of [...prev, ...batch]) map.set(it.id, it);
          return Array.from(map.values()).sort((a, b) => {
            const ta = (a.blockTimeStamp || 0) - 0;
            const tb = (b.blockTimeStamp || 0) - 0;
            if (tb !== ta) return tb - ta;
            return a.id > b.id ? -1 : 1;
          });
        });
        setLoading(false);
      },
      error: (err: unknown) => {
        setError(String(err));
        setLoading(false);
      },
      complete: () => setLoading(false),
    });
    return () => {
      try {
        sub?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, [recipient]);

  const totals = useMemo(() => {
    let totalBase = 0n;
    for (const it of items) {
      try {
        totalBase += BigInt(it.quantity || 0);
      } catch (e) {
        console.error("Invalid quantity", it, e);
      }
    }
    return { totalBaseUnits: totalBase };
  }, [items]);

  const weekly = useMemo<WeeklyPoint[]>(() => {
    const buckets = new Map<number, bigint>();
    for (const it of items) {
      const tsMs = (it.blockTimeStamp || 0) * 1000;
      const week = startOfISOWeek(tsMs);
      const val = (() => {
        try {
          return BigInt(it.quantity || 0);
        } catch {
          return 0n;
        }
      })();
      buckets.set(week, (buckets.get(week) || 0n) + val);
    }
    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([weekStartMs, amountBaseUnits]) => ({
        weekStartMs,
        amountBaseUnits,
      }));
  }, [items]);

  return { loading, error, items, totals, weekly };
}
