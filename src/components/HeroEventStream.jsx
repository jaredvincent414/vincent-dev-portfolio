import { events } from "virtual:hero-events";

// Real activity from GitHub and content/blog, fetched and normalised at build
// time by scripts/hero-events.mjs. Decorative signal behind the hero — never a
// spinner, an error, or a placeholder row. If there is nothing to show, the
// component renders nothing and the hero closes back to a single column.

// Relative rather than a wall-clock time: these events span days, so "3d" says
// more than "06:22:59" would. Computed at render from the build-time
// timestamp, so it stays honest however long a deploy has been live.
const relativeTime = (iso) => {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const [amount, unit] =
    seconds < 3600 ? [seconds / 60, "m"] :
    seconds < 86400 ? [seconds / 3600, "h"] :
    seconds < 2592000 ? [seconds / 86400, "d"] :
    [seconds / 2592000, "mo"];
  return `${Math.max(1, Math.floor(amount))}${unit}`;
};

const HeroEventStream = () => {
  if (events.length === 0) return null;

  return (
    <div
      // Hidden below the hero's two-column breakpoint rather than stacked under
      // the intro, where it would compete with the text it sits behind.
      className="hidden lg:block select-none"
      // Decorative: the same information is on the blog index and on GitHub.
      aria-hidden="true"
      style={{
        // Reads as a stream still running rather than a list that ended.
        maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
      }}
    >
      {/* The panel's box already starts level with the eyebrow, but the rows'
          1.9 leading drops the first line's glyphs ~6px below the eyebrow text.
          Pulling the list up by that half-leading puts the two baselines on the
          same line, which is what actually reads as aligned. */}
      <ul className="font-mono text-[12px] leading-[1.9] -mt-[6px]">
        {events.map((event, index) => (
          <li
            key={`${event.timestamp}-${event.status ?? event.target}-${index}`}
            // Fixed column widths rather than auto: the columns line up down
            // the feed, which is what makes it read as output.
            // Tight, fixed columns: the fields should read as one tabular
            // block, not as four widely separated ones.
            className="hero-event grid grid-cols-[2rem_3.25rem_8rem_minmax(0,1fr)]
                       gap-x-2 whitespace-nowrap"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <span className="text-white/25 tabular-nums text-right">
              {relativeTime(event.timestamp)}
            </span>
            <span className="text-grana-400">{event.kind}</span>
            <span className="text-white/55 truncate">{event.target}</span>
            <span className="text-white/35 truncate">{event.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeroEventStream;
