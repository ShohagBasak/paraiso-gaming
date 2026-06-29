import { EARLY_JOIN_REASONS } from '../../config/site';

const WhyJoinSection = () => {
  return (
    <section
      className="py-24 px-4 section-alt section-diagonal relative overflow-hidden"
      aria-label="Why Join Early"
    >
      {/* Accent blob */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-display text-xs tracking-widest uppercase text-[#00d4e8] font-medium">
            Be Part of It
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#f0f4f8] mt-3 mb-4">
            Why Join{' '}
            <span className="text-gradient">Early</span>
          </h2>
          <p className="text-[#8fa3b8] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Getting in now means more than just waiting — it means being there from day one.
          </p>
        </div>

        {/* Reason rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EARLY_JOIN_REASONS.map((reason) => (
            <div
              key={reason.id}
              className="flex gap-5 p-6 rounded-xl bg-[rgba(13,21,32,0.6)] border border-[rgba(0,212,232,0.08)] hover:border-[rgba(0,212,232,0.25)] transition-all duration-300 group"
            >
              {/* Number badge */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(0,212,232,0.07)] border border-[rgba(0,212,232,0.2)] group-hover:border-[rgba(0,212,232,0.5)] transition-colors duration-300">
                <span className="font-display font-bold text-base text-[#00d4e8]">
                  {String(reason.id).padStart(2, '0')}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-[#f0f4f8] mb-2 group-hover:text-[#00d4e8] transition-colors duration-200">
                  {reason.title}
                </h3>
                <p className="text-[#8fa3b8] text-sm leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinSection;
