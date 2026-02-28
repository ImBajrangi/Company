import React, { useState, useRef } from 'react';

/**
 * TheVoid component – from the_vrinda template.
 * A focused, distraction-free reading view for spiritual texts.
 * Features: Large serif title, author/date meta, inline images, audio player, Archive action.
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
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={`min-h-screen bg-[#050505] text-[#E5E5E5] transition-colors duration-700 ${immersionMode ? '' : ''}`}>
            {/* Back button */}
            <button
                onClick={onBack}
                className="fixed top-8 left-8 z-50 font-mono text-[10px] uppercase tracking-widest text-[#404040] hover:text-[#E5E5E5] transition-colors flex items-center gap-2"
            >
                ← Back
            </button>

            {/* Font size + audio controls */}
            <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
                {audioUrl && (
                    <>
                        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                        <button
                            onClick={toggleAudio}
                            className="font-mono text-[10px] uppercase tracking-widest border border-[#262626] px-3 py-2 hover:border-[#f04242] hover:text-[#f04242] transition-colors"
                        >
                            {isPlaying ? '⏸ Pause' : '♪ Play'}
                        </button>
                    </>
                )}
                <button onClick={() => setFontSize(s => Math.max(s - 2, 14))} className="font-mono text-[10px] text-[#404040] hover:text-[#E5E5E5] border border-[#1a1a1a] px-2 py-1 transition-colors">A-</button>
                <button onClick={() => setFontSize(s => Math.min(s + 2, 36))} className="font-mono text-[10px] text-[#404040] hover:text-[#E5E5E5] border border-[#1a1a1a] px-2 py-1 transition-colors">A+</button>
            </div>

            <article className="max-w-[750px] mx-auto px-8 py-24">
                {/* Title */}
                <h1 className={`${fontClass} leading-[1.1] tracking-tight mb-6 transition-all duration-500`}
                    style={{ fontSize: `calc(${fontSize}px * 2.6)` }}
                >
                    {title || "The Architecture of Silence"}
                </h1>

                {/* Meta */}
                <div className="border-t border-[#262626] pt-4 mb-8 font-mono text-[10px] uppercase tracking-widest text-[#404040] flex flex-wrap gap-4">
                    <span>By {author || "Unknown"}</span>
                    <span>·</span>
                    <span>{readTime || "12"} Min Read</span>
                    <span>·</span>
                    <span>{date || ""}</span>
                </div>

                {/* Tags */}
                {tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-12">
                        {tags.map(tag => (
                            <span key={tag} className="font-mono text-[9px] border border-[#1a1a1a] px-2 py-0.5 text-[#404040]">
                                #{tag.toUpperCase()}
                            </span>
                        ))}
                    </div>
                )}

                {/* Images Grid */}
                {images?.length > 0 && (
                    <div className="mb-12">
                        <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
                                            className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                            onError={e => { e.target.src = src; }}
                                        />
                                        <div className="absolute inset-0 border border-[#f04242]/0 group-hover:border-[#f04242]/30 transition-colors pointer-events-none" />
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

                {/* Content */}
                <div
                    className={`${fontClass} leading-[1.85] tracking-normal space-y-8 transition-all duration-500`}
                    style={{ whiteSpace: 'pre-line', fontSize: `${fontSize}px` }}
                >
                    {content || `In the cacophony of the digital age, silence has become a luxury commodity. We trade our attention for dopamine, scrolling through infinite feeds that demand everything and return nothing. The void is not empty; it is a space where thought can finally expand to fill the container it is given.

True minimalism is not about the absence of objects, but the presence of meaning. When we strip away the decorative chrome of our interfaces, we are left with the raw data of human expression. Text, image, and the empty space that binds them together.

Consider the terminal. A black screen, a blinking cursor. It is the most honest interface we have ever built. It promises nothing but what you put into it. It is a mirror.`}
                </div>

                {/* End of Transmission */}
                <div className="mt-24 pt-12 border-t border-[#262626] flex flex-col items-center gap-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#404040]">End of Transmission.</span>
                    <div className="flex gap-4">
                        <button
                            onClick={onBack}
                            className="px-6 py-3 border border-[#262626] font-mono text-xs uppercase tracking-widest hover:bg-[#E5E5E5] hover:text-[#050505] transition-colors"
                        >
                            [ Back to Archive ]
                        </button>
                    </div>
                </div>

                <div className="flex justify-center mt-12 opacity-30">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[#404040] hover:text-[#E5E5E5] transition-colors">↑</button>
                </div>
            </article>

            {/* Image Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={() => setShowImageModal(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <button
                            className="absolute -top-10 right-0 font-mono text-[#404040] hover:text-white transition-colors text-xl"
                            onClick={() => setShowImageModal(null)}
                        >×</button>
                        <img src={showImageModal} alt="" className="max-w-full max-h-[85vh] object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheVoid;
