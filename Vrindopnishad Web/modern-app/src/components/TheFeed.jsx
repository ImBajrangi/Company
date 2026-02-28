import React from 'react';
import { useMobile } from '../hooks/useMobile';
import TheFeedMobile from './TheFeedMobile';

/**
 * TheFeed – exact clone of the_airlock_3/code.html
 * Note: Layout already provides pl-[60px] for the sidebar, so we subtract 60px from all paddings.
 * Template header: pl-[180px] → we need pl-[120px]
 * Template main:   pl-[120px] → we need pl-[60px]
 */
const TheFeed = ({ items = [], onItemClick }) => {
    const isMobile = useMobile();
    if (isMobile) {
        return <TheFeedMobile items={items} onItemClick={onItemClick} />;
    }
    return (
        <>
            {/* Header – template uses pl-[180px] pt-24 pb-12 pr-12 */}
            <header className="pl-[120px] pt-24 pb-12 pr-12">
                <div className="flex items-end justify-between border-b border-[#262626] pb-4">
                    <div>
                        <h1 className="text-xs font-mono uppercase tracking-[0.3em] text-[#404040] mb-2">
                            System // Directory
                        </h1>
                        <h2 className="text-5xl font-bold tracking-tighter">THE FEED</h2>
                    </div>
                    <div className="flex gap-8 font-mono text-[10px] tracking-widest text-[#404040] uppercase">
                        <a className="text-[#E5E5E5] border-b border-[#E5E5E5] pb-1" href="#">
                            All Transmissions
                        </a>
                        <a className="hover:text-[#E5E5E5] pb-1 transition-colors" href="#">
                            Filtered
                        </a>
                        <a className="hover:text-[#E5E5E5] pb-1 transition-colors" href="#">
                            Archived
                        </a>
                    </div>
                </div>
            </header>

            {/* Main feed – template uses pl-[120px] pb-24 */}
            <main className="pl-[60px] pb-32">
                <div className="flex flex-col gap-4">
                    {items.map((item, idx) => (
                        <div
                            key={item.id || idx}
                            className="feed-row group px-16 py-14 flex flex-col md:flex-row md:items-center justify-between"
                            onClick={() => onItemClick && onItemClick(item)}
                        >
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] uppercase tracking-widest meta-text text-[#404040]">
                                    Transmission // {String(idx + 1).padStart(3, '0')}
                                </span>
                                <h3 className="text-[32px] font-bold leading-none tracking-tight">{item.title}</h3>
                            </div>
                            <div className="flex items-center gap-12 mt-6 md:mt-0 font-mono text-xs uppercase tracking-widest">
                                <div className="flex flex-col items-end">
                                    <span className="meta-text text-[#404040] text-[10px]">Source</span>
                                    <span>{item.source}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="meta-text text-[#404040] text-[10px]">Clarity</span>
                                    <span>{item.clarity}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="meta-text text-[#404040] text-[10px]">Date</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    <div className="px-12 py-20 flex flex-col items-center justify-center opacity-30">
                        <div className="w-1 h-8 bg-[#404040] animate-pulse mb-4" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.5em]">
                            Receiving further data...
                        </span>
                    </div>
                </div>
            </main>

            {/* Fixed bottom-right footer */}
            <footer className="fixed bottom-6 right-8 pointer-events-none">
                <div className="flex items-center gap-4 text-[#404040] font-mono text-[10px] tracking-widest">
                    <span>TOTAL ENTRIES: {items.length}</span>
                    <span className="w-1 h-1 bg-[#f04242] rounded-full" />
                    <span>SYSTEM: NOMINAL</span>
                </div>
            </footer>
        </>
    );
};

export default TheFeed;
