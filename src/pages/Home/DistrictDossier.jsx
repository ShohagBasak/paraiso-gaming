import { DISTRICTS } from '../../config/site';

const ACCENT_COLORS = {
  amber: { rule: 'var(--pg-amber)', watermark: 'rgba(232,166,53,0.04)', tag: 'var(--pg-amber)' },
  teal:  { rule: 'var(--pg-teal)',  watermark: 'rgba(26,138,125,0.04)',  tag: 'var(--pg-teal)' },
  red:   { rule: 'var(--pg-red)',   watermark: 'rgba(196,64,64,0.04)',   tag: 'var(--pg-red)' },
};

const DossierPanel = ({ district, index }) => {
  const accent = ACCENT_COLORS[district.accentColor] || ACCENT_COLORS.amber;
  const isReversed = index % 2 !== 0;

  return (
    <div className="dossier-panel rounded-sm overflow-hidden">
      <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

        {/* Text content */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          {/* Department header */}
          <div className="flex items-center gap-3 mb-1">
            <div className="h-px w-6" style={{ background: accent.rule }} />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: accent.rule }}>
              {district.dept}
            </span>
          </div>

          {/* Feature title */}
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--pg-text)] mt-3 mb-3">
            {district.title}
          </h3>

          {/* Body */}
          <p className="text-[var(--pg-muted)] text-sm leading-relaxed mb-5 max-w-md">
            {district.body}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {district.tags.map((tag) => (
              <span
                key={tag}
                className="tag-badge"
                style={{ borderColor: `color-mix(in srgb, ${accent.tag} 30%, transparent)`, color: accent.tag }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Watermark / decorative block */}
        <div
          className="hidden lg:flex items-center justify-center w-48 flex-shrink-0 relative overflow-hidden"
          style={{ background: accent.watermark }}
        >
          <span
            className="font-display font-bold text-[120px] leading-none select-none pointer-events-none"
            style={{ color: `color-mix(in srgb, ${accent.rule} 8%, transparent)` }}
          >
            {district.watermark}
          </span>
          {/* Vertical filing line */}
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{
              background: `color-mix(in srgb, ${accent.rule} 10%, transparent)`,
              left: isReversed ? 'auto' : '0',
              right: isReversed ? '0' : 'auto',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const DistrictDossier = () => {
  return (
    <section id="dossier" className="py-20 sm:py-28 px-5 sm:px-8" aria-label="City Districts — Gameplay Features">
      <div className="max-w-6xl mx-auto">

        {/* Section header — left aligned */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[var(--pg-teal)]" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--pg-teal)] uppercase">
              City Departments
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--pg-text)] mb-3">
            District Dossier
          </h2>
          <p className="text-[var(--pg-muted)] text-sm sm:text-base max-w-xl leading-relaxed">
            Every corner of Paraíso is being designed with depth. Here is what the city departments are building for launch.
          </p>
        </div>

        {/* Dossier panels */}
        <div className="space-y-4 sm:space-y-6">
          {DISTRICTS.map((district, index) => (
            <DossierPanel key={district.id} district={district} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default DistrictDossier;
