import { FaDiscord } from 'react-icons/fa';
import { SITE } from '../../config/site';

const CommunityCtaSection = () => {
  return (
    <section className="py-24 px-4" aria-label="Community CTA">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl border border-[rgba(0,212,232,0.2)] cta-glow-border text-center px-8 py-16"
          style={{
            background: 'linear-gradient(135deg, rgba(13,21,32,0.95) 0%, rgba(18,29,42,0.95) 50%, rgba(13,21,32,0.95) 100%)',
          }}
        >
          {/* Background radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,212,232,0.07) 0%, transparent 65%)',
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[rgba(0,212,232,0.4)] rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[rgba(0,212,232,0.4)] rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[rgba(0,212,232,0.4)] rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[rgba(0,212,232,0.4)] rounded-br-2xl" />

          <div className="relative z-10">
            {/* Discord icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5865F2] mb-6 mx-auto shadow-[0_0_32px_rgba(88,101,242,0.4)]">
              <FaDiscord size={32} className="text-white" />
            </div>

            {/* Heading */}
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#f0f4f8] mb-4 leading-tight">
              Join the{' '}
              <span className="text-gradient">Community</span>
            </h2>

            <p className="text-[#8fa3b8] text-base sm:text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              The Discord server is live and growing. This is where launch announcements, staff applications, and community discussions happen.
            </p>
            <p className="text-[#64748b] text-sm mb-10">
              Early access · Stay updated · Help shape the server
            </p>

            {/* CTA button */}
            <a
              href={SITE.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-display font-bold text-base tracking-wide transition-all duration-200 hover:shadow-[0_0_40px_rgba(88,101,242,0.6)] hover:scale-105"
            >
              <FaDiscord size={20} />
              Join Discord — It's Free
            </a>

            {/* Sub-note */}
            <p className="text-[#4a5568] text-xs mt-6">
              Opens discord.gg/WAbSw5dFG in a new tab
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityCtaSection;
