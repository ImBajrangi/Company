import React from 'react';
import { useMobile } from '../hooks/useMobile';
import TheStratificationMobile from './TheStratificationMobile';

/**
 * TheStratification – exact clone of the_airlock_5/code.html
 * Template uses: min-h-screen flex flex-col p-6 md:p-12 lg:p-16
 * Fixed nav: p-8 bg-void/80 backdrop-blur-md
 * Grid: grid-cols-1 lg:grid-cols-12 gap-12, aside col-span-3, section col-span-9
 * Tier markers with active state, rank table with "YOU" badge, scrollable overflow
 */

const TheStratification = () => {
    const isMobile = useMobile();
    if (isMobile) {
        return <TheStratificationMobile />;
    }
    const operators = [
        { rank: '04', name: 'OPERATOR_772', kw: '1,240.82', uptime: '428D:12H:04M', isYou: true },
        { rank: '01', name: 'OPERATOR_NULL', kw: '4,821.11', uptime: '892D:04H:11M' },
        { rank: '02', name: 'S_PROTO_9', kw: '3,102.44', uptime: '741D:21H:30M' },
        { rank: '03', name: 'VOID_WALKER_X', kw: '2,994.00', uptime: '610D:02H:55M' },
    ];

    // Generate more rows like the template does with JS
    const moreOperators = ['K_LEVEL_5', 'GHOST_SIGNAL', 'V_ARCHIVE_1', 'ECHO_DEPTH', 'DEEP_DIVE_0', 'SIGMA_VOID', 'OMEGA_POINT'];
    for (let i = 5; i <= 25; i++) {
        const name = moreOperators[i % moreOperators.length] + '_' + Math.floor(Math.random() * 999);
        operators.push({
            rank: i < 10 ? '0' + i : String(i),
            name,
            kw: (1200 - (i * 12)).toFixed(2),
            uptime: `${Math.floor(Math.random() * 400)}D:${Math.floor(Math.random() * 24)}H:${Math.floor(Math.random() * 60)}M`,
        });
    }

    return (
        <div className="min-h-screen flex flex-col p-6 md:p-12 lg:p-16">
            {/* Nav – template: fixed top-0 left-0 w-full p-8 z-50 bg-void/80 backdrop-blur-md border-b */}
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#1a1a1a]/50">
                <div className="font-mono text-[10px] tracking-[0.4em] text-[#404040] flex items-center gap-4">
                    <span className="w-2 h-2 bg-[#f04242]" />
                    THE_STRATIFICATION // RANKINGS_v4.0
                </div>
                <div className="flex gap-12">
                    <a className="font-mono text-[10px] tracking-[0.2em] hover:text-[#f04242] transition-colors" href="#">
                        [ ACCESS_DOSSIER ]
                    </a>
                    <a className="font-mono text-[10px] tracking-[0.2em] hover:text-[#f04242] transition-colors" href="#">
                        [ LOGOUT ]
                    </a>
                </div>
            </nav>

            {/* Main grid – template: mt-24 grid-cols-1 lg:grid-cols-12 gap-12 */}
            <main className="w-full mx-auto mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow">
                {/* Left sidebar – col-span-3 */}
                <aside className="lg:col-span-3 space-y-12">
                    <div className="sticky top-32">
                        <h1 className="font-display text-4xl font-bold tracking-tighter mb-16 leading-none">
                            THE<br />STRATIFICATION
                        </h1>
                        <div className="flex flex-col">
                            {/* Active tier */}
                            <div className="relative pl-8 py-12 border-l border-[#f04242] text-[#f04242]">
                                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#f04242]" />
                                <span className="font-mono text-[10px] tracking-[0.3em] block opacity-50 mb-1">LVL_04</span>
                                <h2 className="font-display text-2xl font-bold tracking-widest">VOID_LORD</h2>
                            </div>
                            {/* Inactive tiers */}
                            <div className="relative pl-8 py-12 border-l border-[#1a1a1a] opacity-40">
                                <span className="font-mono text-[10px] tracking-[0.3em] block mb-1">LVL_03</span>
                                <h2 className="font-display text-2xl font-bold tracking-widest">ARCHIVIST</h2>
                            </div>
                            <div className="relative pl-8 py-12 border-l border-[#1a1a1a] opacity-40">
                                <span className="font-mono text-[10px] tracking-[0.3em] block mb-1">LVL_02</span>
                                <h2 className="font-display text-2xl font-bold tracking-widest">DECRYPTOR</h2>
                            </div>
                            <div className="relative pl-8 py-12 border-l border-[#1a1a1a] opacity-40">
                                <span className="font-mono text-[10px] tracking-[0.3em] block mb-1">LVL_01</span>
                                <h2 className="font-display text-2xl font-bold tracking-widest">NOVICE</h2>
                            </div>
                        </div>
                        <div className="mt-16 pt-8 border-t border-[#1a1a1a]">
                            <div className="font-mono text-[10px] text-[#404040] space-y-2">
                                <p>CURRENT_STATUS: ASCENDING</p>
                                <p>NEXT_THRESHOLD: 1,500_KW</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right section – col-span-9 */}
                <section className="lg:col-span-9 space-y-8">
                    <div className="flex justify-between items-end border-b border-[#1a1a1a] pb-4">
                        <div className="font-mono text-xs text-[#404040] tracking-widest">ACTIVE_OPERATORS [50]</div>
                        <div className="font-mono text-[10px] text-[#f04242] animate-pulse">LIVE_FEED_SYNCED</div>
                    </div>

                    <div className="overflow-hidden border border-[#1a1a1a]">
                        {/* Table header */}
                        <div className="grid grid-cols-12 font-mono text-[10px] tracking-widest text-[#404040] bg-white/5 py-3 px-6 border-b border-[#1a1a1a] uppercase">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-5">Operator_ID</div>
                            <div className="col-span-3 text-right">Knowledge_Weight</div>
                            <div className="col-span-3 text-right">Uptime</div>
                        </div>

                        {/* Table rows – max-h-[70vh] overflow-y-auto */}
                        <div className="divide-y divide-[#1a1a1a] overflow-y-auto max-h-[70vh]" style={{ scrollbarWidth: 'none' }}>
                            {operators.map((op, idx) => (
                                <div
                                    key={idx}
                                    className={`grid grid-cols-12 items-center font-mono text-sm px-6 ${op.isYou
                                        ? 'py-5 bg-[#f04242]/10 border-l-2 border-l-[#f04242]'
                                        : 'py-4 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`col-span-1 ${op.isYou ? 'text-[#f04242] font-bold' : 'text-[#404040]'}`}>
                                        {op.rank}
                                    </div>
                                    <div className="col-span-5 flex items-center gap-3">
                                        <span className={`tracking-tighter ${op.isYou ? 'text-[#f04242]' : ''}`}>
                                            {op.name}
                                        </span>
                                        {op.isYou && (
                                            <span className="text-[9px] bg-[#f04242] text-white px-1 font-bold">YOU</span>
                                        )}
                                    </div>
                                    <div className="col-span-3 text-right font-light">{op.kw} KW</div>
                                    <div className="col-span-3 text-right text-[#404040] text-xs">{op.uptime}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center pt-4">
                        <div className="font-mono text-[9px] text-[#404040] tracking-[0.2em] uppercase">
                            [ Scroll to decrypt further depth ]
                        </div>
                        <div className="flex gap-4">
                            <button className="border border-[#1a1a1a] p-2 hover:bg-white hover:text-[#050505] transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="border border-[#1a1a1a] p-2 hover:bg-white hover:text-[#050505] transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-24 pt-12 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-end opacity-40">
                <div className="font-mono text-[10px] space-y-1">
                    <p>SYSTEM_REVISION: ALPHA_4.12.0</p>
                    <p>DATA_INTEGRITY: 100%_VERIFIED</p>
                </div>
                <div className="text-right font-mono text-[10px] mt-4 md:mt-0">
                    <p>© 2024 THE_VRINDA_RECORDS // ARCHIVAL_ACCESS_ONLY</p>
                    <p>TERMINAL: STACK_009_NODE_4</p>
                </div>
            </footer>
        </div>
    );
};

export default TheStratification;
