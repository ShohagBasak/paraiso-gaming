import { TICKER_ITEMS } from '../../config/site';

const StatusTicker = () => {
  return (
    <section className="ticker-strip" aria-label="City Status">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Desktop: horizontal strip */}
        <div className="hidden sm:flex items-center justify-between py-4 gap-4">
          {/* Left label */}
          <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--pg-dim)] uppercase flex-shrink-0">
            CITY STATUS
          </span>

          <div className="h-px flex-1 bg-[rgba(232,166,53,0.08)]" />

          {/* Ticker items */}
          <div className="flex items-center gap-0 flex-shrink-0">
            {TICKER_ITEMS.map((item, i) => (
              <div key={item.id} className="flex items-center">
                {i > 0 && <div className="ticker-divider mx-4" />}
                <div className="flex items-center gap-2.5">
                  <span className={`status-dot ${item.variant}`} />
                  <span className="font-mono text-[11px] tracking-wider text-[var(--pg-muted)]">
                    {item.label}:
                  </span>
                  <span className="font-mono text-[11px] tracking-wider text-[var(--pg-text)] font-medium">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: 2×2 grid */}
        <div className="sm:hidden grid grid-cols-2 gap-3 py-4">
          {TICKER_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className={`status-dot ${item.variant}`} />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] tracking-wider text-[var(--pg-dim)] uppercase">
                  {item.label}
                </span>
                <span className="font-mono text-[11px] tracking-wider text-[var(--pg-text)] font-medium">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatusTicker;
