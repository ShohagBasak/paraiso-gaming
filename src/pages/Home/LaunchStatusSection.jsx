import { STATUS_CARDS } from '../../config/site';

// Map variant → colors without emoji
const VARIANT_STYLES = {
  success: {
    dotClass: 'success',
    statusColor: 'text-green-400',
    borderColor: 'rgba(34,197,94,0.25)',
    labelColor: 'text-[#f0f4f8]',
  },
  warning: {
    dotClass: 'warning',
    statusColor: 'text-amber-400',
    borderColor: 'rgba(245,158,11,0.25)',
    labelColor: 'text-[#f0f4f8]',
  },
  neutral: {
    dotClass: 'neutral',
    statusColor: 'text-[#64748b]',
    borderColor: 'rgba(100,116,139,0.2)',
    labelColor: 'text-[#8fa3b8]',
  },
};

const StatusCard = ({ label, status, variant }) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;

  return (
    <div
      className="flex flex-col gap-4 px-6 py-6 rounded-xl bg-[rgba(13,21,32,0.8)] backdrop-blur-md border transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,232,0.07)]"
      style={{ borderColor: styles.borderColor }}
    >
      <div className="flex items-center gap-2">
        <span className={`status-dot ${styles.dotClass}`} />
        <span className={`font-display font-semibold text-sm tracking-widest uppercase ${styles.statusColor}`}>
          {status}
        </span>
      </div>
      <p className={`font-display font-bold text-xl ${styles.labelColor}`}>{label}</p>
    </div>
  );
};

const LaunchStatusSection = () => {
  return (
    <section className="py-20 px-4 section-alt" aria-label="Launch Status">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <span className="font-display text-xs tracking-widest uppercase text-[#00d4e8] font-medium">
            Current Status
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#f0f4f8] mt-3 mb-4">
            Preparing for{' '}
            <span className="text-gradient">Launch</span>
          </h2>
          <p className="text-[#8fa3b8] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            The server is being built from the ground up. Join the Discord to follow every milestone.
          </p>
        </div>

        {/* Status cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_CARDS.map((card) => (
            <StatusCard
              key={card.id}
              label={card.label}
              status={card.status}
              variant={card.variant}
            />
          ))}
        </div>

        {/* Progress bar — visual only, honest framing */}
        <div className="mt-12 p-6 rounded-xl bg-[rgba(13,21,32,0.6)] border border-[rgba(0,212,232,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-semibold text-sm text-[#8fa3b8] tracking-wide">
              Pre-Launch Progress
            </span>
            <span className="font-display font-bold text-sm text-[#00d4e8]">Foundation Phase</span>
          </div>
          <div className="w-full h-2 bg-[rgba(0,212,232,0.08)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00d4e8] to-[#3b82f6] transition-all duration-700"
              style={{ width: '35%' }}
              role="progressbar"
              aria-valuenow={35}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Pre-launch progress at foundation phase"
            />
          </div>
          <p className="text-xs text-[#4a5568] mt-3">
            Progress is illustrative of the build phase, not a hard timeline.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LaunchStatusSection;
