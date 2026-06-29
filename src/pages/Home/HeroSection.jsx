import { FaDiscord } from 'react-icons/fa';
import { SITE, HERO } from '../../config/site';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden warm-glow" aria-label="City Dispatch Hero">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── Left Column — Main Dispatch ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Dispatch label */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[var(--pg-amber)]" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--pg-amber)] uppercase">
                {HERO.label}
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--pg-text)] leading-[1.05] tracking-tight">
              {HERO.heading}
            </h1>

            {/* Body */}
            <p className="text-[var(--pg-muted)] text-base sm:text-lg leading-relaxed max-w-xl">
              {HERO.body}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <a
                href={SITE.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[var(--pg-amber)] hover:bg-[#d4952e] text-[#0c0e12] font-display font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:shadow-[0_0_24px_rgba(232,166,53,0.35)]"
              >
                <FaDiscord size={16} />
                {HERO.ctaPrimary}
              </a>
              <a
                href="#dossier"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--pg-border-warm)] text-[var(--pg-amber)] hover:bg-[var(--pg-amber-dim)] font-display font-semibold text-sm tracking-wider uppercase transition-all duration-200"
              >
                {HERO.ctaSecondary}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right Column — Dispatch Notice ── */}
          <div className="lg:col-span-5 lg:mt-8">
            <div className="dispatch-card p-6 sm:p-8 lg:rotate-[1.2deg] lg:hover:rotate-0 transition-transform duration-500">
              {/* Notice header */}
              <div className="mb-5 pb-4 border-b border-[rgba(232,166,53,0.12)]">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--pg-amber)] uppercase block mb-1">
                  {HERO.dispatch.header}
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--pg-text)]">
                  {HERO.dispatch.title}
                </h2>
              </div>

              {/* Notice body */}
              <p className="text-[var(--pg-muted)] text-sm leading-relaxed mb-6">
                {HERO.dispatch.body}
              </p>

              {/* Notice CTA */}
              <a
                href={SITE.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--pg-amber)] font-display font-semibold text-sm tracking-wide hover:text-[var(--pg-text)] transition-colors group"
              >
                <FaDiscord size={14} />
                {HERO.dispatch.cta}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>

              {/* Stamp / filing mark */}
              <div className="mt-6 pt-4 border-t border-[rgba(232,166,53,0.08)] flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-wider text-[var(--pg-dim)] uppercase">
                  Filed: City Hall · Paraíso Municipal District
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom separator */}
      <div className="section-rule max-w-7xl mx-auto" />
    </section>
  );
};

export default HeroSection;
