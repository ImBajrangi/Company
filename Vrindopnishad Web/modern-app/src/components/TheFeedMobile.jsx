import React from 'react';

/**
 * TheFeedMobile component – from the_airlock_15 template.
 * Mobile-specific feed/transmission view.
 */
const TheFeedMobile = ({ items = [], onItemClick }) => {
    return (
        <div className="bg-[#050505] text-[#E5E5E5] font-display antialiased selection:bg-white selection:text-black min-h-screen flex flex-col items-center pt-24 pb-32">
            {/* Header */}
            <header className="w-full p-6 pt-12 flex justify-between items-end fixed top-0 bg-[#050505]/80 backdrop-blur-md z-40 border-b border-white/10">
                <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-[#666666] tracking-widest uppercase mb-1">Transmission // Stream</span>
                    <h1 className="text-3xl font-bold tracking-tighter uppercase leading-none">The Feed</h1>
                </div>
                <div className="font-mono text-[10px] text-[#666666] mb-1">
                    v4.0.2
                </div>
            </header>

            {/* Main feed list */}
            <main className="w-full flex-1">
                {items.length > 0 ? items.map((item, idx) => (
                    <article
                        key={item.id || idx}
                        className="p-6 border-b border-white/10 cursor-pointer active:bg-white active:text-black transition-colors duration-300 group"
                        onClick={() => onItemClick && onItemClick(item)}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start font-mono text-[9px] uppercase tracking-widest text-[#666666] group-active:text-black/60">
                                <span>{item.source || 'Trans. // 0882-X'}</span>
                                <span>{item.date || '14.02.24'}</span>
                            </div>
                            <h2 className="text-4xl font-semibold leading-[0.95] tracking-tight pr-8 uppercase">
                                {item.title}
                            </h2>
                            <div className="flex gap-6 font-mono text-[10px] uppercase text-[#666666] group-active:text-black/60">
                                <div className="flex flex-col">
                                    <span className="opacity-50">Source</span>
                                    <span className="text-[#E5E5E5] group-active:text-black">{item.author || 'Null_Vector'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="opacity-50">Clarity</span>
                                    <span className="text-[#E5E5E5] group-active:text-black">{item.clarity || '98.4%'}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                )) : (
                    // Default items if none provided (as per template)
                    [
                        "Architectural Collapse in the Fourth Quadrant",
                        "Silencing the Echoes of the Void",
                        "New Protocols for Data Ascension",
                        "The Geometry of Permanent Darkness",
                        "Unlinked: The Ghost in the Buffer"
                    ].map((title, idx) => (
                        <article
                            key={idx}
                            className="p-6 border-b border-white/10 cursor-pointer active:bg-white active:text-black transition-colors duration-300 group"
                        >
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-start font-mono text-[9px] uppercase tracking-widest text-[#666666] group-active:text-black/60">
                                    <span>Trans. // {882 - idx}-X</span>
                                    <span>{14 - idx}.02.24</span>
                                </div>
                                <h2 className="text-4xl font-semibold leading-[0.95] tracking-tight pr-8 uppercase">
                                    {title}
                                </h2>
                                <div className="flex gap-6 font-mono text-[10px] uppercase text-[#666666] group-active:text-black/60">
                                    <div className="flex flex-col">
                                        <span className="opacity-50">Source</span>
                                        <span className="text-[#E5E5E5] group-active:text-black">Sentinel</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="opacity-50">Clarity</span>
                                        <span className="text-[#E5E5E5] group-active:text-black">98.4%</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </main>

            {/* Mobile Nav Interface Fluff */}
            <aside className="fixed right-4 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 rotate-90 origin-right pointer-events-none">
                <span className="font-mono text-[10px] tracking-[1em] uppercase whitespace-nowrap text-white">DEEP VOID MOBILE INTERFACE // SECURED</span>
            </aside>

            <div className="fixed inset-0 pointer-events-none noise-overlay z-50 opacity-02"></div>
        </div>
    );
};

export default TheFeedMobile;
