import { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChainOfCommand = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/chain-of-command/blocks`);
        if (!res.ok) throw new Error('Failed to fetch layouts');
        const data = await res.json();
        setBlocks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading Chain of Command blocks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlocks();
  }, []);

  // Groups consecutive blocks of type half_box with width 'half'
  const groupBlocks = (blockList) => {
    const grouped = [];
    let currentGroup = null;

    blockList.forEach((block) => {
      if (block.type === 'half_box' && block.content.width === 'half') {
        if (!currentGroup) {
          currentGroup = { type: 'half_box_group', blocks: [block] };
          grouped.push(currentGroup);
        } else {
          currentGroup.blocks.push(block);
          if (currentGroup.blocks.length === 2) {
            currentGroup = null;
          }
        }
      } else {
        currentGroup = null;
        grouped.push(block);
      }
    });

    return grouped;
  };

  const getTextStyle = (content) => {
    const style = {};
    if (content.color) style.color = content.color;
    return style;
  };

  const getTextClass = (content) => {
    const classes = [];
    if (content.alignment === 'center') classes.push('text-center');
    else if (content.alignment === 'right') classes.push('text-right');
    else classes.push('text-left');

    if (content.bold) classes.push('font-bold');
    if (content.italic) classes.push('italic');
    if (content.underline) classes.push('underline');
    if (content.strikethrough) classes.push('line-through');

    if (content.type === 'title') {
      classes.push('text-2xl sm:text-3xl font-black uppercase tracking-widest my-4');
    } else if (content.type === 'subtitle') {
      classes.push('text-lg sm:text-xl font-bold uppercase tracking-wider my-2');
    } else if (content.type === 'bullet') {
      classes.push('text-slate-300 text-xs sm:text-sm leading-relaxed pl-4 list-disc my-1');
    } else {
      classes.push('text-slate-300 text-xs sm:text-sm leading-relaxed my-2');
    }

    return classes.join(' ');
  };

  const getImageSizeClass = (size) => {
    if (size === 'sm') return 'w-24 h-24';
    if (size === 'lg') return 'w-64 h-64';
    if (size === 'full') return 'w-full object-cover';
    return 'w-36 h-36 sm:w-44 sm:h-44';
  };

  const getImageAlignClass = (align) => {
    if (align === 'left') return 'justify-start';
    if (align === 'right') return 'justify-end';
    return 'justify-center';
  };

  const renderBlock = (block, index) => {
    const { type, content } = block;

    switch (type) {
      case 'text':
        return (
          <div key={block.id || index} className={getTextClass(content)} style={getTextStyle(content)}>
            {content.text}
          </div>
        );

      case 'title_strokes':
        return (
          <div key={block.id || index} className="relative flex items-center gap-4 py-2 my-8">
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to right, transparent, ${content.color}33, ${content.color}80)` }}
            />
            <h3
              className="text-base sm:text-lg font-black uppercase tracking-[0.25em] whitespace-nowrap"
              style={{ color: content.color || '#22d3ee', textShadow: `0 0 12px ${content.color || '#22d3ee'}40` }}
            >
              {content.text}
            </h3>
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to left, transparent, ${content.color}33, ${content.color}80)` }}
            />
          </div>
        );

      case 'image':
        return (
          <div key={block.id || index} className={`flex ${getImageAlignClass(content.alignment)} my-6`}>
            <img
              src={content.url}
              alt={content.alt || 'Chain of Command'}
              className={`${getImageSizeClass(content.size)} object-contain drop-shadow-[0_0_20px_rgba(201,168,76,0.35)] hover:scale-105 transition-transform duration-500`}
            />
          </div>
        );

      case 'half_box':
        // Full width box rendering
        return (
          <div
            key={block.id || index}
            className="bg-[#0b0f15] border border-slate-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
            style={{
              borderTop: `2px solid ${content.color || '#22d3ee'}66`
            }}
          >
            <div className="space-y-3">
              {(content.lines || []).map((line, lIdx) => {
                const isTitle = line.type === 'title';
                const isSubtitle = line.type === 'subtitle';
                const isBullet = line.type === 'bullet';

                const lineClass = [
                  line.alignment === 'center' ? 'text-center' : line.alignment === 'right' ? 'text-right' : 'text-left',
                  line.bold ? 'font-bold' : '',
                  line.italic ? 'italic' : '',
                  line.underline ? 'underline' : '',
                  line.strikethrough ? 'line-through' : '',
                  isTitle ? 'text-base sm:text-lg font-black uppercase tracking-wider' :
                  isSubtitle ? 'text-xs sm:text-sm font-semibold uppercase italic' : 'text-xs sm:text-sm leading-relaxed text-slate-300'
                ].filter(Boolean).join(' ');

                return (
                  <div key={lIdx} className={lineClass} style={{ color: line.color || '#cbd5e1' }}>
                    {isBullet && <span className="mr-1.5">•</span>}
                    {line.text}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'hybrid_box':
        return (
          <div key={block.id || index} className="border border-slate-900 rounded-3xl p-6 sm:p-8 bg-[#0b0f15] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: content.color || '#22d3ee', opacity: 0.4 }} />

            <h4 className="text-lg font-black uppercase tracking-wider mb-2" style={{ color: content.color || '#22d3ee' }}>
              {content.title}
            </h4>
            {content.subtitle && (
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-semibold">
                {content.subtitle}
              </p>
            )}

            {/* Reports Section */}
            {((content.sub_boxes && content.sub_boxes.length > 0) || content.columns_title) && (
              <div className="bg-[#080d13] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                {content.columns_title && (
                  <p className="text-xs uppercase tracking-wider font-black border-b border-slate-800 pb-2" style={{ color: (content.color || '#22d3ee') + 'd9' }}>
                    {content.columns_title}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(content.sub_boxes || []).map((group, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                        {group.title}
                      </p>
                      <div className="space-y-2 pl-2">
                        {(group.items || []).map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-start gap-2.5">
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: content.color || '#22d3ee',
                                boxShadow: `0 0 8px ${content.color || '#22d3ee'}`
                              }}
                            />
                            <span className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {content.footer && (
                  <div className="pt-3 border-t border-slate-800/60 text-slate-400 text-xs leading-relaxed font-medium">
                    {content.footer}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'signature':
        return (
          <div key={block.id || index} className="pt-12 border-t border-slate-900/60 flex flex-col items-start pl-4 select-none my-6">
            <style dangerouslySetInnerHTML={{
              __html: `
              @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
            `}} />
            <p
              className="text-white text-3xl md:text-4xl font-normal tracking-wide mb-1"
              style={{
                fontFamily: "'Dancing Script', cursive",
                textShadow: `0 0 8px ${content.color || '#fff'}33`
              }}
            >
              {content.name}
            </p>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{
                color: content.color || '#fbbf24',
                textShadow: `0 0 10px ${content.color || '#fbbf24'}4d`
              }}
            >
              {content.role}
            </p>
            {content.office && (
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {content.office}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Group blocks for half width rendering
  const groupedElements = groupBlocks(blocks);

  return (
    <div
      className="min-h-screen text-white pb-24"
      style={{
        backgroundColor: '#050811',
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.02) 0%, transparent 70%),
          linear-gradient(160deg, #050811 0%, #070c18 40%, #04070d 100%)
        `,
        backgroundSize: '36px 36px, 36px 36px, 100% 100%, 100% 100%',
        fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
      }}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Command Structure...</span>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 pt-28 space-y-12">
          {groupedElements.map((element, idx) => {
            if (element.type === 'half_box_group') {
              // Side-by-side display for half-width blocks
              return (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {element.blocks.map((halfBlock, subIdx) => (
                    <div key={halfBlock.id || subIdx} className="h-full">
                      {renderBlock(halfBlock, subIdx)}
                    </div>
                  ))}
                </div>
              );
            }
            return renderBlock(element, idx);
          })}
        </div>
      )}
    </div>
  );
};

export default ChainOfCommand;
