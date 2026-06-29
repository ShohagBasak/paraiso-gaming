import { FaDiscord } from 'react-icons/fa';
import { SITE, RADIO } from '../../config/site';

const RadioCta = () => {
  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8 warm-glow relative overflow-hidden" aria-label="Radio Paraíso — Join Discord">
      {/* Background warm glow — stronger here */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(232,166,53,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top noise strip */}
        <div className="radio-noise mb-10" />

        {/* Frequency label */}
        <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--pg-amber)] uppercase block mb-6">
          ░░ {RADIO.frequency} ░░
        </span>

        {/* Intro + heading */}
        <p className="text-[var(--pg-dim)] text-sm sm:text-base mb-1 tracking-wide">
          {RADIO.intro}
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--pg-text)] mb-8 leading-tight uppercase tracking-wide">
          {RADIO.heading}
        </h2>

        {/* Broadcast copy */}
        <p className="text-[var(--pg-muted)] text-base sm:text-lg leading-relaxed max-w-2xl italic mb-10">
          {RADIO.body}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <a
            href={SITE.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--pg-amber)] hover:bg-[#d4952e] text-[#0c0e12] font-display font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:shadow-[0_0_28px_rgba(232,166,53,0.35)]"
          >
            <FaDiscord size={16} />
            {RADIO.cta}
          </a>
          <span className="hidden sm:block font-mono text-[10px] tracking-wider text-[var(--pg-dim)]">
            Tune in on Discord
          </span>
        </div>

        {/* Bottom noise strip */}
        <div className="radio-noise mt-14" />
      </div>
    </section>
  );
};

export default RadioCta;
