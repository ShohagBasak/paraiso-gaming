import { FaDiscord } from 'react-icons/fa';
import { SITE, CHARTER } from '../../config/site';

const FoundingCharter = () => {
  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8" aria-label="Founding Citizen Charter">
      <div className="max-w-3xl mx-auto">

        {/* Charter document */}
        <div className="charter-doc rounded-sm px-6 sm:px-10 py-10 sm:py-14">

          {/* Document header */}
          <div className="text-center mb-10 pb-8 border-b border-[rgba(26,138,125,0.12)]">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--pg-teal)] uppercase block mb-3">
              {CHARTER.directive}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--pg-text)] mb-1">
              {CHARTER.header}
            </h2>
            <p className="font-mono text-xs tracking-[0.1em] text-[var(--pg-dim)] uppercase">
              {CHARTER.subheader}
            </p>
          </div>

          {/* Charter sections */}
          <div className="space-y-8">
            {CHARTER.sections.map((section) => (
              <div key={section.id} className="flex gap-4 sm:gap-6">
                {/* Section marker */}
                <div className="flex-shrink-0 pt-0.5">
                  <span className="font-mono text-sm text-[var(--pg-teal)] font-medium">
                    § {section.id}
                  </span>
                </div>

                {/* Section content */}
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--pg-text)] mb-1.5 uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <p className="text-[var(--pg-muted)] text-sm leading-relaxed">
                    {section.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Document footer / CTA */}
          <div className="mt-10 pt-8 border-t border-[rgba(26,138,125,0.12)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] tracking-wider text-[var(--pg-dim)] uppercase block">
                  Registration open via dispatch frequency
                </span>
              </div>
              <a
                href={SITE.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-[var(--pg-teal)] hover:bg-[#158575] text-white font-display font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:shadow-[0_0_20px_rgba(26,138,125,0.3)] flex-shrink-0"
              >
                <FaDiscord size={14} />
                {CHARTER.cta}
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FoundingCharter;
