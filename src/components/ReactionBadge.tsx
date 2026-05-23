import { displayCount } from '@/lib/rating';
import type { ReactionAgg } from '@/hooks/useReactions';

/**
 * Compact reaction strip rendered next to each audio sample. Caller is
 * expected to gate visibility (badge renders nothing when up+down are
 * zero — keeps a fresh discography uncluttered).
 *
 * Visual: ★★★☆☆ · 8↑ 2↓
 */
export default function ReactionBadge({ agg }: { agg: ReactionAgg }) {
  const { up, down, stars } = agg;
  if (up === 0 && down === 0) return null;
  return (
    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground/70">
      {stars > 0 && (
        <span className="text-foreground/80" aria-label={`${stars} of 5 stars`}>
          {'★'.repeat(stars)}<span className="text-muted-foreground/30">{'★'.repeat(5 - stars)}</span>
        </span>
      )}
      {stars > 0 && (up > 0 || down > 0) && <span>·</span>}
      {up > 0 && <span>{displayCount(up)}↑</span>}
      {down > 0 && <span>{displayCount(down)}↓</span>}
    </span>
  );
}
