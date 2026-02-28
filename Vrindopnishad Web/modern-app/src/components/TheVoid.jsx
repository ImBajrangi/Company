import React, { useState, useRef } from 'react';

/**
 * TheVoid component – reader view, mobile-friendly.
 * Responsive controls, flexible layout, safe padding for mobile bottom nav.
 */
const TheVoid = ({
    title, author, date, readTime, content, onBack = () => { },
    settings = { typeface: 'serif', baseSize: 20, immersionMode: true },
    audioUrl, images = [], tags = []
}) => {
    const { typeface, baseSize, immersionMode } = settings;
    const fontClass = typeface === 'serif' ? 'font-body' : 'font-mono';

    const [fontSize, setFontSize] = useState(baseSize);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showImageModal, setShowImageModal] = useState(null);
    const [showControls, setShowControls] = useState(true);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#E5E5E5] transition-colors duration-700">
            {/* Top bar — sticky so it stays in flow and doesn't overlap content */}
            <div style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                    onClick={onBack}
                    className="font-mono"
                    style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#404040', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    ← Back
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {audioUrl && (
                        <>
                            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                            <button
                                onClick={toggleAudio}
                                className="font-mono"
                                style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid #262626', padding: '4px 8px', background: 'none', color: '#E5E5E5', cursor: 'pointer' }}
                            >
                                {isPlaying ? '⏸' : '♪'}
                            </button>
                        </>
                    )}
                    <button onClick={() => setFontSize(s => Math.max(s - 2, 14))} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1a1a1a', background: 'none', color: '#404040', cursor: 'pointer', fontSize: '12px' }}>A-</button>
                    <button onClick={() => setFontSize(s => Math.min(s + 2, 36))} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1a1a1a', background: 'none', color: '#404040', cursor: 'pointer', fontSize: '12px' }}>A+</button>
                </div>
            </div>

            <article className="w-full max-w-[750px] mx-auto px-6 md:px-12 pb-32" style={{ paddingTop: '20px' }}>
                {/* Title — responsive sizing */}
                <h1
                    className={`${fontClass} leading-[1.1] tracking-tight mb-6 transition-all duration-500`}
                    style={{ fontSize: `clamp(28px, calc(${fontSize}px * 2.2), calc(${fontSize}px * 2.6))` }}
                >
                    {title || "The Architecture of Silence"}
                </h1>

                {/* Meta */}
                <div className="border-t border-[#262626] pt-4 mb-8 font-mono text-[10px] uppercase tracking-widest text-[#404040] flex flex-wrap gap-3 md:gap-4">
                    <span>By {author || "Unknown"}</span>
                    <span>·</span>
                    <span>{readTime || "12"} Min</span>
                    <span>·</span>
                    <span>{date || ""}</span>
                </div>

                {/* Tags */}
                {tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                        {tags.map(tag => (
                            <span key={tag} className="font-mono text-[9px] border border-[#1a1a1a] px-2 py-0.5 text-[#404040]">
                                #{tag.toUpperCase()}
                            </span>
                        ))}
                    </div>
                )}

                {/* Images Grid — responsive */}
                {images?.length > 0 && (
                    <div className="mb-10">
                        <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {images.map((img, idx) => {
                                const src = typeof img === 'string' ? img : img.url;
                                const imgTitle = typeof img === 'object' ? img.title : '';
                                return (
                                    <div
                                        key={idx}
                                        className="relative overflow-hidden border border-[#1a1a1a] cursor-pointer group"
                                        onClick={() => setShowImageModal(src)}
                                    >
                                        <img
                                            src={`https://imbajrangi.github.io/Company/Vrindopnishad%20Web/sketch/main/${src}`}
                                            alt={imgTitle || title}
                                            className="w-full h-36 md:h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                            onError={e => { e.target.src = src; }}
                                        />
                                        {imgTitle && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-[#050505]/80 px-3 py-2 font-mono text-[9px] text-[#525252] opacity-0 group-hover:opacity-100 transition-opacity">
                                                {imgTitle}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Content — responsive font */}
                <div
                    className={`${fontClass} leading-[1.85] tracking-normal space-y-6 transition-all duration-500`}
                    style={{ whiteSpace: 'pre-line', fontSize: `${fontSize}px` }}
                >
                    {content || `In the cacophony of the digital age, silence has become a luxury commodity. We trade our attention for dopamine, scrolling through infinite feeds that demand everything and return nothing.

True minimalism is not about the absence of objects, but the presence of meaning. When we strip away the decorative chrome of our interfaces, we are left with the raw data of human expression.

Consider the terminal. A black screen, a blinking cursor. It is the most honest interface we have ever built.`}
                </div>

                {/* End of Transmission */}
                <div className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-[#262626] flex flex-col items-center gap-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#404040]">End of Transmission.</span>
                    <button
                        onClick={onBack}
                        className="px-6 py-3 border border-[#262626] font-mono text-xs uppercase tracking-widest hover:bg-[#E5E5E5] hover:text-[#050505] transition-colors"
                    >
                        [ Back to Archive ]
                    </button>
                </div>

                <div className="flex justify-center mt-8 opacity-30">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[#404040] hover:text-[#E5E5E5] transition-colors text-xl">↑</button>
                </div>
            </article>

            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowImageModal(null)}>
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <button className="absolute -top-8 right-0 font-mono text-[#404040] hover:text-white transition-colors text-xl" onClick={() => setShowImageModal(null)}>×</button>
                        <img src={showImageModal} alt="" className="max-w-full max-h-[85vh] object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheVoid;
