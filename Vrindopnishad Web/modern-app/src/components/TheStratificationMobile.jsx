import React from 'react';

/**
 * TheStratificationMobile component – from the_airlock_14 template.
 * Mobile-specific stratification/tier list.
 */
const TheStratificationMobile = () => {
    return (
        <div className="bg-[#050505] text-[#E5E5E5] h-screen w-full overflow-hidden font-mono antialiased relative flex flex-col pt-24">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 bg-[#050505]/80 backdrop-blur-md border-b border-[#1A1A1A]">
                <div className="flex flex-col">
                    <span className="text-[10px] text-[#FF3333] tracking-[0.3em] font-bold uppercase">System.Access</span>
                    <h1 className="text-lg font-bold tracking-tighter uppercase font-display">The Stratification</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="text-right">
                        <div className="text-[8px] text-[#555555] uppercase">Sync_Rate</div>
                        <div className="text-[10px] text-[#FF3333]">99.98%</div>
                    </div>
                    <button className="material-symbols-outlined text-[#555555] hover:text-[#FF3333] transition-colors">menu</button>
                </div>
            </header>

            <main className="relative z-10 h-full w-full flex overflow-hidden">
                {/* Left Tier Sidebar */}
                <div className="w-20 h-full border-r border-[#1A1A1A] flex flex-col items-center py-8 relative bg-[#0A0A0A]">
                    <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-[#1A1A1A] to-transparent"></div>
                    <div className="flex flex-col items-center h-full justify-between py-4">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[8px] text-[#555555] [writing-mode:vertical-rl] text-orientation-mixed uppercase tracking-widest">Level_01</span>
                            <div className="w-[1px] h-8 bg-[#1A1A1A]"></div>
                        </div>

                        <div className="flex flex-col items-center gap-12 flex-1 justify-center py-10">
                            {[
                                { name: 'Void Lord', active: false },
                                { name: 'Commander', active: false },
                                { name: 'Operator', active: true },
                                { name: 'Acolyte', active: false },
                                { name: 'Novice', active: false },
                            ].map((tier, idx) => (
                                <div key={idx} className="group relative flex items-center">
                                    {tier.active && <div className="absolute -left-4 w-2 h-[1px] bg-[#FF3333]"></div>}
                                    <span className={`absolute left-8 whitespace-nowrap uppercase tracking-tighter transition-colors ${tier.active ? 'text-[11px] text-[#FF3333] font-bold' : 'text-[10px] text-[#555555] group-hover:text-[#E5E5E5]'}`}>
                                        {tier.name}
                                    </span>
                                    {tier.active ? (
                                        <div className="w-3 h-3 bg-[#FF3333] rotate-45 shadow-[0_0_10px_rgba(255,51,51,0.5)]"></div>
                                    ) : (
                                        <div className="w-2 h-2 border border-[#555555] rotate-45"></div>
                                    )}
                                    {tier.active && <div className="absolute right-[-10px] w-2 h-[1px] bg-[#FF3333]"></div>}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-[1px] h-8 bg-[#1A1A1A]"></div>
                            <span className="text-[8px] text-[#555555] [writing-mode:vertical-rl] text-orientation-mixed uppercase tracking-widest">Base_Floor</span>
                        </div>
                    </div>
                </div>

                {/* Right Scrollable List */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-4 flex justify-between items-end border-b border-[#1A1A1A] bg-[#050505]">
                        <span className="text-[10px] text-[#555555] uppercase tracking-[0.2em]">Local_Peers</span>
                        <span className="text-[10px] text-[#555555] uppercase tracking-[0.2em]">Weight.val</span>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-2">
                        <div className="space-y-1">
                            {[
                                { id: '001', name: 'V_REVENANT', weight: '142,880.04' },
                                { id: '002', name: 'NULL_VECTOR', weight: '128,004.91' },
                            ].map((peer) => (
                                <div key={peer.id} className="flex items-center justify-between p-4 border border-transparent opacity-40 hover:opacity-100 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] text-[#555555] font-bold">{peer.id}</span>
                                        <span className="text-xs tracking-tight">{peer.name}</span>
                                    </div>
                                    <span className="text-xs text-[#555555]">{peer.weight}</span>
                                </div>
                            ))}

                            {/* Current User */}
                            <div className="flex items-center justify-between p-4 bg-[#FF3333]/5 border-y border-[#FF3333]/20 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FF3333]"></div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-[#FF3333] font-bold">003</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-[#E5E5E5]">USER_ALPHA</span>
                                        <span className="w-1 h-3 bg-[#FF3333] animate-pulse"></span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-[#FF3333] font-bold">94,202.11</span>
                                    <span className="text-[8px] text-[#FF3333]/60 uppercase">Active_Link</span>
                                </div>
                            </div>

                            {[
                                { id: '004', name: 'GHOST_SIGNAL', weight: '82,119.00' },
                                { id: '005', name: 'STARK_VOID', weight: '77,402.15' },
                                { id: '006', name: 'MONOLITH_X', weight: '64,001.22' },
                                { id: '007', name: 'NEON_DRIFT', weight: '59,332.90' },
                                { id: '008', name: 'CRYPT_WALKER', weight: '51,002.11' },
                            ].map((peer) => (
                                <div key={peer.id} className="flex items-center justify-between p-4 border border-transparent opacity-40 hover:opacity-100 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] text-[#555555] font-bold">{peer.id}</span>
                                        <span className="text-xs tracking-tight">{peer.name}</span>
                                    </div>
                                    <span className="text-xs text-[#555555]">{peer.weight}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Progress */}
                    <div className="p-6 bg-[#0A0A0A] border-t border-[#1A1A1A] w-full">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-[#555555] uppercase tracking-widest">Next Evolution</span>
                                <div className="w-32 h-[2px] bg-[#1A1A1A] relative">
                                    <div className="absolute left-0 top-0 h-full w-[65%] bg-[#FF3333]"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-[#E5E5E5] font-bold">5,797 WEIGHT TO CMD</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center font-mono text-[8px] text-[#555555] uppercase tracking-[0.3em]">
                            <span>SEC_TOKEN: 0x82...F4</span>
                            <span className="text-[#FF3333]/60">Strat_v4.0.1</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Visual Ruler Fluff */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 pr-1 pointer-events-none">
                <div className="w-1 h-1 bg-[#1A1A1A]"></div>
                <div className="w-1 h-6 bg-[#FF3333]/20"></div>
                <div className="w-1 h-1 bg-[#1A1A1A]"></div>
            </div>

            <div className="fixed inset-0 pointer-events-none noise-overlay z-50 opacity-04"></div>
        </div>
    );
};

export default TheStratificationMobile;
