import React, { useState } from 'react';
import { Minus, Plus, Maximize2, Minimize2, Cpu, Settings } from 'lucide-react';

const Reader = ({ title, content, author, tags = [] }) => {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [fontSize, setFontSize] = useState(22); // px
    const [isSerif, setIsSerif] = useState(true);

    return (
        <div className={`reader-container ${isFocusMode ? 'fixed inset-0 z-[100] bg-bg-void p-12 overflow-y-auto' : ''}`}>
            <div className="max-w-[850px] mx-auto">
                {/* Controls Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 mb-12 border-b border-border-thin/50">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Cpu size={14} className="text-accent-holo" />
                            <span className="font-mono-meta text-[10px] text-accent-holo uppercase tracking-widest">READ_PROCESS: INITIALIZED</span>
                        </div>
                        <h2 className="text-4xl font-mono-ui font-medium uppercase tracking-tight text-text-primary">{title || "Archive_Null"}</h2>
                        <div className="flex gap-4">
                            {author && <p className="font-mono-meta text-xs text-text-muted uppercase">// SOURCE: {author}</p>}
                            <span className="font-mono-meta text-xs text-text-muted uppercase">// SECTOR 04</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Options Panel */}
                        <div className="flex items-center gap-2 p-1 bg-bg-void border border-border-thin chamfer-clip">
                            <button
                                onClick={() => setFontSize(Math.max(fontSize - 2, 14))}
                                className="size-8 flex items-center justify-center text-text-muted hover:text-accent-holo transition-colors"
                                title="Decrease Scale"
                            >
                                <Minus size={16} />
                            </button>
                            <div className="h-4 w-[1px] bg-border-thin"></div>
                            <span className="font-mono-ui text-xs text-text-primary w-10 text-center">{fontSize}px</span>
                            <div className="h-4 w-[1px] bg-border-thin"></div>
                            <button
                                onClick={() => setFontSize(Math.min(fontSize + 2, 56))}
                                className="size-8 flex items-center justify-center text-text-muted hover:text-accent-holo transition-colors"
                                title="Increase Scale"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsSerif(!isSerif)}
                            className="flex items-center gap-2 px-4 py-2 bg-bg-void border border-border-thin hover:border-accent-holo transition-all chamfer-clip"
                        >
                            <Settings size={14} className="text-text-muted" />
                            <span className="font-mono-ui text-[10px] font-bold text-text-primary uppercase">{isSerif ? 'SERIF_MODE' : 'MONO_MODE'}</span>
                        </button>

                        <button
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className="flex items-center justify-center size-10 bg-bg-void border border-border-thin hover:border-accent-holo text-accent-holo transition-all chamfer-clip"
                            title="Immersion Mode"
                        >
                            {isFocusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <article
                    className="leading-[1.7] tracking-normal mb-24 selection:bg-accent-holo selection:text-bg-deep transition-all"
                    style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: isSerif ? 'var(--font-serif-body)' : 'var(--font-mono-ui)',
                        whiteSpace: 'pre-line'
                    }}
                >
                    {content || "No data fragments found in localized memory."}
                </article>

                {/* Tags / Meta */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-4 pt-10 border-t border-border-thin/30">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-2 font-mono-meta text-[10px] text-text-muted uppercase tracking-[0.15em]">
                                <span className="text-accent-holo opacity-50">#</span>{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reader;
