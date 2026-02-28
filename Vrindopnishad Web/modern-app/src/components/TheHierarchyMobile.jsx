import React from 'react';

/**
 * TheHierarchyMobile – exact clone of the_airlock_10/code.html
 * Mobile rankings view with side ruler, tier markers, ranking nodes list,
 * footer with ascension progress bar and bottom nav.
 */
const TheHierarchyMobile = () => {
    return (
        <div className="bg-[#050505] text-[#E5E5E5] font-mono antialiased overflow-hidden min-h-screen w-full flex flex-col pt-16 pb-0 border-x border-[#1A1A1A] mx-auto relative">
            {/* Header */}
            <header className="p-6 border-b border-[#1A1A1A] bg-[#050505]/80 backdrop-blur-md z-40">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="text-[10px] text-[#525252] tracking-[0.3em] uppercase mb-1">System // Rank</div>
                        <h1 className="text-xl font-bold tracking-tighter uppercase">The Hierarchy</h1>
                    </div>
                    <button className="material-symbols-outlined text-[#525252]">more_vert</button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="text-[9px] text-[#525252] uppercase mb-1">Current Tier</div>
                        <div className="text-sm font-bold tracking-widest text-[#FF3333]">OPERATOR [02]</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] text-[#525252] uppercase mb-1">Global Weight</div>
                        <div className="text-sm">94,202.11</div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Side Ruler */}
                <aside className="w-20 relative border-r border-[#1A1A1A] flex flex-col items-center py-8">
                    <div
                        className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-[1px] opacity-30"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom, #525252 1px, transparent 1px)',
                            backgroundSize: '100% 20px',
                        }}
                    />
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-32">
                        <div className="rotate-90 origin-left translate-x-3 text-[10px] text-[#525252]/40 uppercase tracking-widest whitespace-nowrap">
                            Commander
                        </div>
                        <div className="relative flex items-center justify-center">
                            <div className="w-10 h-10 border border-[#FF3333]/30 flex items-center justify-center bg-[#050505]">
                                <div className="w-4 h-0.5 bg-[#FF3333]" style={{ boxShadow: '0 0 15px rgba(255,51,51,0.4)' }} />
                            </div>
                            <div className="absolute left-12 whitespace-nowrap text-[10px] font-bold text-[#FF3333] tracking-widest">
                                LEVEL_02
                            </div>
                        </div>
                        <div className="rotate-90 origin-left translate-x-3 text-[10px] text-[#525252]/40 uppercase tracking-widest whitespace-nowrap">
                            Acolyte
                        </div>
                    </div>
                </aside>

                {/* Rankings List */}
                <section className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    <div className="sticky top-0 bg-[#050505] border-b border-[#1A1A1A] px-4 py-3 z-20 flex justify-between items-center">
                        <span className="text-[9px] text-[#525252] tracking-widest uppercase">Stratification List</span>
                        <span className="text-[9px] text-[#525252] uppercase">T-34 Nodes</span>
                    </div>
                    <div className="divide-y divide-[#1A1A1A]">
                        {/* Node 001 */}
                        <div className="p-4 flex flex-col gap-1 opacity-40 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold tracking-tight">V_REVENANT</span>
                                <span className="text-[9px] text-[#525252]">#001</span>
                            </div>
                            <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="text-[#525252] uppercase tracking-tighter">Weight: 142,880.04</span>
                                <span className="text-[#525252]">[OFFLINE]</span>
                            </div>
                        </div>
                        {/* Node 002 */}
                        <div className="p-4 flex flex-col gap-1 opacity-40 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold tracking-tight">NULL_VECTOR</span>
                                <span className="text-[9px] text-[#525252]">#002</span>
                            </div>
                            <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="text-[#525252] uppercase tracking-tighter">Weight: 128,004.91</span>
                                <span className="text-[#525252]">[IDLE]</span>
                            </div>
                        </div>
                        {/* Current User – Node 003 */}
                        <div className="p-4 bg-[#FF3333]/5 border-l-2 border-[#FF3333] relative overflow-hidden">
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold tracking-tight text-white">USER_ALPHA</span>
                                        <span className="w-1.5 h-3 bg-[#FF3333] animate-pulse" />
                                    </div>
                                    <span className="text-[9px] text-[#FF3333] font-bold">#003</span>
                                </div>
                                <div className="flex justify-between items-center font-mono text-[10px]">
                                    <span className="text-[#E5E5E5] uppercase tracking-tighter font-medium">Weight: 94,202.11</span>
                                    <span className="text-[#FF3333] font-bold tracking-widest">[LINKED]</span>
                                </div>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10">
                                <span className="material-symbols-outlined text-4xl">sensors</span>
                            </div>
                        </div>
                        {/* Node 004 */}
                        <div className="p-4 flex flex-col gap-1 opacity-40 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold tracking-tight">GHOST_SIGNAL</span>
                                <span className="text-[9px] text-[#525252]">#004</span>
                            </div>
                            <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="text-[#525252] uppercase tracking-tighter">Weight: 82,119.00</span>
                                <span className="text-[#525252]">[OFFLINE]</span>
                            </div>
                        </div>
                        {/* Node 005 */}
                        <div className="p-4 flex flex-col gap-1 opacity-40 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold tracking-tight">STARK_VOID</span>
                                <span className="text-[9px] text-[#525252]">#005</span>
                            </div>
                            <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="text-[#525252] uppercase tracking-tighter">Weight: 77,402.15</span>
                                <span className="text-[#525252]">[OFFLINE]</span>
                            </div>
                        </div>
                        {/* Node 006 */}
                        <div className="p-4 flex flex-col gap-1 opacity-40 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold tracking-tight">MONOLITH_X</span>
                                <span className="text-[9px] text-[#525252]">#006</span>
                            </div>
                            <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="text-[#525252] uppercase tracking-tighter">Weight: 64,001.22</span>
                                <span className="text-[#525252]">[OFFLINE]</span>
                            </div>
                        </div>
                        <div className="h-32" />
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="p-6 border-t border-[#1A1A1A] bg-[#050505] z-40">
                <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-[#525252] uppercase tracking-widest">Ascension Progress</span>
                        <div className="w-32 h-1 bg-[#1A1A1A]">
                            <div className="h-full bg-[#FF3333] w-2/3" />
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] text-[#525252] uppercase block">Next Tier Evolution</span>
                        <span className="text-[10px] text-[#E5E5E5] font-bold">+5,797.89</span>
                    </div>
                </div>
                <nav className="flex justify-between items-center pt-4 border-t border-[#1A1A1A]/50">
                    <button className="material-symbols-outlined text-[#FF3333] text-xl">grid_view</button>
                    <button className="material-symbols-outlined text-[#525252] text-xl hover:text-[#E5E5E5]">search</button>
                    <button className="material-symbols-outlined text-[#525252] text-xl hover:text-[#E5E5E5]">account_circle</button>
                    <button className="material-symbols-outlined text-[#525252] text-xl hover:text-[#E5E5E5]">settings</button>
                </nav>
            </footer>

            {/* Visual dots */}
            <div className="absolute bottom-24 left-4 z-50">
                <div className="flex flex-col gap-1 opacity-20">
                    <div className="w-1 h-1 bg-[#525252]" />
                    <div className="w-1 h-1 bg-[#525252]" />
                    <div className="w-1 h-1 bg-[#FF3333]" />
                </div>
            </div>
        </div>
    );
};

export default TheHierarchyMobile;
