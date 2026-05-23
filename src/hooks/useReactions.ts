import { useEffect, useMemo, useState } from 'react';
import { classifyReaction, starRating, type ReactionKind } from '@/lib/rating';

// Read reactions from the relays ndisc.blobtree (and future ndisc.smpl)
// publish to. Mirror the publisher's relay set so we don't miss events.
const REACTION_RELAYS = ['wss://relay.fizx.uk', 'wss://nos.lol'];

export type ReactionAgg = {
  up: number;
  down: number;
  info: number;
  stars: number;
};

const EMPTY: ReactionAgg = { up: 0, down: 0, info: 0, stars: 0 };

/**
 * Aggregate kind:7 reactions for a set of kind:1063 audio sample events.
 * Returns a stable forSample(id) selector + a loading flag.
 *
 * One WebSocket subscription per relay, filtered by #e (the sample IDs).
 * Per-sample, per-reactor we keep only the latest kind:7 — so changing
 * your mind (up → down) is honored, and ballot-stuffing from one pubkey
 * is not.
 */
export function useReactions(sampleIds: string[]) {
  // Stable key so we re-subscribe only when the visible sample set
  // actually changes, not on every parent re-render.
  const key = useMemo(() => [...sampleIds].sort().join('|'), [sampleIds]);

  const [agg, setAgg] = useState<Record<string, ReactionAgg>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sampleIds.length === 0) {
      setAgg({});
      setLoading(false);
      return;
    }
    setLoading(true);

    const idSet = new Set(sampleIds);
    // sampleId → reactorPk → { kind, ts } — latest per reactor wins
    const latest: Record<string, Map<string, { kind: ReactionKind; ts: number }>> = {};

    const recompute = () => {
      const out: Record<string, ReactionAgg> = {};
      for (const [sid, reactors] of Object.entries(latest)) {
        let up = 0, down = 0, info = 0;
        for (const r of reactors.values()) {
          if (r.kind === 'up') up++;
          else if (r.kind === 'down') down++;
          else if (r.kind === 'info') info++;
        }
        out[sid] = { up, down, info, stars: starRating(up, down) };
      }
      setAgg(out);
    };

    const sockets: WebSocket[] = [];
    let eoseCount = 0;
    const expectedEose = REACTION_RELAYS.length;

    REACTION_RELAYS.forEach(url => {
      let ws: WebSocket;
      try { ws = new WebSocket(url); } catch { return; }
      sockets.push(ws);
      const subId = `r-${Math.random().toString(36).slice(2, 8)}`;

      ws.onopen = () => {
        try {
          ws.send(JSON.stringify(['REQ', subId, { kinds: [7], '#e': sampleIds }]));
        } catch { /* ignore */ }
      };

      ws.onmessage = (ev) => {
        try {
          const m = JSON.parse(ev.data as string);
          if (!Array.isArray(m)) return;
          if (m[0] === 'EVENT' && m[1] === subId) {
            const e = m[2] as { kind: number; pubkey: string; created_at: number; content: string; tags: string[][] };
            if (!e || e.kind !== 7) return;
            // ndisc.blobtree emits [e, p, k] tags; pick the e-tag that
            // matches one of our known sample IDs.
            const eTags = e.tags.filter(t => t[0] === 'e').map(t => t[1]);
            const sid = eTags.find(id => idSet.has(id));
            if (!sid) return;
            const kind = classifyReaction(e.content);
            if (kind === 'other') return;
            if (!latest[sid]) latest[sid] = new Map();
            const prev = latest[sid].get(e.pubkey);
            if (!prev || e.created_at > prev.ts) {
              latest[sid].set(e.pubkey, { kind, ts: e.created_at });
              recompute();
            }
          } else if (m[0] === 'EOSE' && m[1] === subId) {
            eoseCount++;
            if (eoseCount >= expectedEose) setLoading(false);
          }
        } catch { /* malformed frame */ }
      };

      ws.onerror = () => {
        eoseCount++;
        if (eoseCount >= expectedEose) setLoading(false);
      };
    });

    // Safety timeout if no relay EOSEs in 5s.
    const t = setTimeout(() => setLoading(false), 5000);

    return () => {
      clearTimeout(t);
      sockets.forEach(ws => { try { ws.close(); } catch { /* ignore */ } });
    };
    // sampleIds + idSet derive from `key`; eslint can't see that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const forSample = useMemo(() => {
    return (id: string): ReactionAgg => agg[id] ?? EMPTY;
  }, [agg]);

  return { forSample, loading };
}
