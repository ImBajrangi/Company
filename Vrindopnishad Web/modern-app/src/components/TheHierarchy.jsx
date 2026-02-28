import React from 'react';
import { useMobile } from '../hooks/useMobile';
import TheHierarchyMobile from './TheHierarchyMobile';

/**
 * TheHierarchy – exact clone of the_airlock_16/code.html (the_airlock_1)
 * Full-screen centered layout with tier sidebar on left, user table on right.
 * Template uses: h-screen overflow-hidden, flex items-center justify-center pt-24 px-12
 * grid-cols-12 max-w-6xl gap-12 h-[70vh]
 */

const USERS = [
    { pos: '001', name: 'V_REVENANT', weight: '142.880.04', status: 'OFFLINE' },
    { pos: '002', name: 'NULL_VECTOR', weight: '128.004.91', status: 'IDLE' },
    { pos: '003', name: 'USER_ALPHA', weight: '94.202.11', status: 'ACTIVE_LINK', isCurrentUser: true },
    { pos: '004', name: 'GHOST_SIGNAL', weight: '82.119.00', status: 'OFFLINE' },
    { pos: '005', name: 'STARK_VOID', weight: '77.402.15', status: 'OFFLINE' },
    { pos: '006', name: 'MONOLITH_X', weight: '64.001.22', status: 'OFFLINE' },
];

const TheHierarchy = () => {
    const isMobile = useMobile();
    if (isMobile) {
        return <TheHierarchyMobile />;
    }
    return (
        <div className="h-screen w-full overflow-hidden font-display antialiased selection:bg-[#333333] selection:text-white relative">
            {/* Top nav – fixed full width */}
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-start z-50 pointer-events-none">
                <div className="flex flex-col gap-1 pointer-events-auto">
                    <span className="font-mono text-[10px] text-[#404040] tracking-widest uppercase">
                        Protocol // Archive
                    </span>
                    <h2 className="text-xl font-bold tracking-tighter uppercase">The Hierarchy</h2>
                </div>
                <div className="flex items-center gap-6 pointer-events-auto">
                    <div className="text-right flex flex-col items-end">
                        <span className="font-mono text-[10px] text-[#404040] tracking-widest uppercase">
                            System Load
                        </span>
                        <span className="font-mono text-xs text-[#f04242]">0.0004%</span>
                    </div>
                    <button className="material-symbols-outlined text-[#404040] hover:text-[#E5E5E5] transition-colors">
                        close
                    </button>
                </div>
            </nav>

            {/* Main centered content */}
            <main className="relative z-10 h-full w-full flex items-center justify-center pt-24 px-12">
                <div className="grid grid-cols-12 w-full max-w-6xl gap-12 h-[70vh]">
                    {/* Left tier sidebar – col-span-3 */}
                    <div className="col-span-3 flex flex-col justify-between py-4 border-r border-[#262626] relative">
                        <div
                            className="absolute right-[-1px] top-0 bottom-0 w-px"
                            style={{
                                background: 'linear-gradient(to bottom, transparent, #404040 10%, #404040 90%, transparent)',
                            }}
                        />
                        {/* Tier: Zenith / Commander */}
                        <div className="flex flex-col gap-2">
                            <span className="font-mono text-[10px] text-[#404040] uppercase tracking-[0.2em]">
                                01 / Zenith
                            </span>
                            <h3 className="text-2xl font-bold tracking-tight opacity-20">COMMANDER</h3>
                        </div>
                        {/* Tier: Active / Operator */}
                        <div className="flex flex-col gap-2 relative">
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#f04242] rounded-full" />
                            <span className="font-mono text-[10px] text-[#f04242] uppercase tracking-[0.2em]">
                                02 / Active Tier
                            </span>
                            <h3 className="text-2xl font-bold tracking-tight text-[#E5E5E5]">OPERATOR</h3>
                            <div className="h-px w-12 bg-[#f04242]/40 mt-1" />
                        </div>
                        {/* Tier: Base / Acolyte */}
                        <div className="flex flex-col gap-2">
                            <span className="font-mono text-[10px] text-[#404040] uppercase tracking-[0.2em]">
                                03 / Base
                            </span>
                            <h3 className="text-2xl font-bold tracking-tight opacity-20">ACOLYTE</h3>
                        </div>
                    </div>

                    {/* Right table area – col-span-9 */}
                    <div className="col-span-9 flex flex-col h-full">
                        {/* Table header */}
                        <div className="grid grid-cols-12 pb-4 border-b border-[#262626] font-mono text-[10px] text-[#404040] uppercase tracking-[0.2em]">
                            <div className="col-span-1">Pos</div>
                            <div className="col-span-6">Identity</div>
                            <div className="col-span-3">Contribution Weight</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {/* Table rows */}
                        <div className="flex-1 overflow-y-auto font-mono text-sm py-4" style={{ scrollbarWidth: 'none' }}>
                            {USERS.map((user) =>
                                user.isCurrentUser ? (
                                    <div
                                        key={user.pos}
                                        className="grid grid-cols-12 py-5 border-y border-[#f04242]/30 bg-[#f04242]/5 relative group"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f04242]" />
                                        <div className="col-span-1 text-[#f04242] pl-4">{user.pos}</div>
                                        <div className="col-span-6 flex items-center gap-2">
                                            <span className="text-[#E5E5E5] font-bold">{user.name}</span>
                                            <span
                                                className="w-2 h-4 bg-[#f04242] inline-block"
                                                style={{ animation: 'blink 1s step-end infinite' }}
                                            />
                                        </div>
                                        <div className="col-span-3 text-[#E5E5E5]">{user.weight}</div>
                                        <div className="col-span-2 text-right text-[10px] text-[#f04242] pr-4">
                                            [ {user.status} ]
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={user.pos}
                                        className="grid grid-cols-12 py-3 border-b border-white/5 opacity-40 hover:opacity-100 hover:bg-white hover:text-black hover:px-4 -mx-4 transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="col-span-1">{user.pos}</div>
                                        <div className="col-span-6 flex items-center gap-2">
                                            <span>{user.name}</span>
                                            <span className="w-1.5 h-3 bg-transparent hover:bg-[#f04242]" style={{ animation: 'blink 1s step-end infinite' }} />
                                        </div>
                                        <div className="col-span-3">{user.weight}</div>
                                        <div className="col-span-2 text-right text-[10px]">[ {user.status} ]</div>
                                    </div>
                                )
                            )}
                            {/* Truncated indicator */}
                            <div className="grid grid-cols-12 py-3 border-b border-white/5 opacity-20">
                                <div className="col-span-1">...</div>
                                <div className="col-span-6">---</div>
                                <div className="col-span-3">---</div>
                                <div className="col-span-2 text-right text-[10px]">---</div>
                            </div>
                        </div>

                        {/* Bottom stats */}
                        <div className="mt-auto pt-8 flex justify-between border-t border-[#262626]">
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[10px] text-[#404040] uppercase tracking-widest">
                                    Global Density
                                </span>
                                <div className="flex items-center gap-1">
                                    <div className="w-16 h-1 bg-[#262626] overflow-hidden">
                                        <div className="w-3/4 h-full bg-[#404040]" />
                                    </div>
                                    <span className="font-mono text-[10px] text-[#404040]">74%</span>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                                <span className="font-mono text-[10px] text-[#404040] uppercase tracking-widest">
                                    Next Evolution
                                </span>
                                <span className="font-mono text-xs text-[#E5E5E5]">10,000 WEIGHT REMAINING</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right sidebar strip */}
            <aside className="fixed right-0 top-0 bottom-0 w-16 border-l border-[#262626] flex flex-col items-center justify-center gap-12 z-20">
                <div className="rotate-90 origin-center whitespace-nowrap font-mono text-[10px] tracking-[0.5em] text-[#404040] uppercase">
                    Ascension Protocol v1.4
                </div>
                <div className="flex flex-col gap-4">
                    <div className="w-1 h-1 rounded-full bg-[#f04242] shadow-[0_0_8px_#f04242]" />
                    <div className="w-1 h-1 rounded-full bg-[#262626]" />
                    <div className="w-1 h-1 rounded-full bg-[#262626]" />
                </div>
            </aside>

            {/* Bottom-left footer */}
            <footer className="fixed bottom-8 left-8 flex gap-8 font-mono text-[10px] text-[#404040] uppercase tracking-widest z-50">
                <span>Depth: 14,000km</span>
                <span className="text-[#f04242]">Syncing...</span>
            </footer>
        </div>
    );
};

export default TheHierarchy;
