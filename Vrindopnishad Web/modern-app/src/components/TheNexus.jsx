import React from 'react';

/**
 * TheNexus component – from the_airlock_2 template.
 * High-density desktop dashboard.
 */
const TheNexus = ({ onSignalClick, onTransmissionClick }) => {
    return (
        <div className="min-h-screen bg-[#000] text-[#E5E5E5] font-mono selection:bg-[#FF3333] selection:text-white flex flex-col pt-20">
            {/* Top Bar Label */}
            <div className="px-12 py-8 flex justify-between items-center opacity-40 text-[10px] tracking-[0.3em] uppercase border-b border-[#1A1A1A]">
                <span>System_Access // THE_NEXUS_V.4.0</span>
                <div className="flex gap-16">
                    <span className="cursor-pointer hover:text-[#E5E5E5]" onClick={() => onSignalClick && onSignalClick({ id: 'archives' })}>[ ARCHIVES ]</span>
                    <span className="cursor-pointer hover:text-[#E5E5E5] text-[#FF3333]" onClick={() => onSignalClick && onSignalClick({ id: 'feed' })}>[ TRANSMIT ]</span>
                    <span className="cursor-pointer hover:text-[#E5E5E5]" onClick={() => onSignalClick && onSignalClick({ id: 'grid' })}>[ TERMINAL ]</span>
                </div>
            </div>

            {/* Main Header Logo */}
            <header className="px-12 py-16 border-b border-[#1A1A1A]">
                <h1 className="text-[12rem] font-black tracking-tighter leading-none mb-8">THE_VRINDA<span className="animate-pulse text-[#FF3333]">.</span></h1>
                <div className="flex justify-between items-end">
                    <p className="max-w-md text-sm opacity-60 leading-relaxed uppercase">
                        Deep-tech blog & archival platform for the silent majority.
                        Decrypting the future of decentralised intelligence.
                    </p>
                    <div className="text-right text-[10px] opacity-40 tracking-widest leading-loose">
                        COORD: 40.7128° N, 74.0060° W<br />
                        SIGNAL_STATUS: STABLE
                    </div>
                </div>
            </header>

            {/* Grid Layout */}
            <main className="flex-1 grid grid-cols-12 divide-x divide-[#1A1A1A]">

                {/* Column 1: Latest Signals */}
                <section className="col-span-4 p-8 flex flex-col gap-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-[#FF3333]"></div>
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase">Latest_Signals</h2>
                    </div>

                    <div className="space-y-16">
                        {[
                            { date: '2024.05.12 // 04:22', title: 'QUANTUM_ENTROPY_LEAK', desc: 'Analyzing the recent disturbances in the subnet-7 encryption layers...' },
                            { date: '2024.05.10 // 21:15', title: 'NEURAL_DECAY_PROTOCOLS', desc: 'Understanding the limits of synthetic memory retention in long-void exposure.' },
                            { date: '2024.05.08 // 09:44', title: 'THE_SILENT_SERVERS', desc: 'Mapping the decommissioned data centers in Sector 9.' }
                        ].map((signal, idx) => (
                            <div key={idx} className="group cursor-pointer" onClick={() => onSignalClick && onSignalClick(signal)}>
                                <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-1">{signal.date}</span>
                                <h3 className="text-2xl font-bold tracking-tight mb-3 group-hover:text-[#FF3333] transition-colors">{signal.title}</h3>
                                <p className="text-xs opacity-60 leading-relaxed max-w-sm">{signal.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button className="mt-auto self-start border border-[#1A1A1A] px-6 py-2 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
                        [ VIEW_ALL_SIGNALS ]
                    </button>
                </section>

                {/* Column 2: System Metrics */}
                <section className="col-span-4 p-8 flex flex-col gap-16">
                    <h2 className="text-xs font-bold tracking-[0.3em] opacity-40 uppercase">System_Metrics</h2>

                    <div className="space-y-16">
                        <div>
                            <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-2">Operators_Online</span>
                            <div className="text-6xl font-medium tracking-tighter">1,240,882</div>
                            <div className="w-full h-px bg-[#1A1A1A] mt-4"></div>
                        </div>

                        <div>
                            <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-2">Data_Processed (PB)</span>
                            <div className="text-6xl font-medium tracking-tighter">89.442</div>
                            <div className="w-full h-px bg-[#1A1A1A] mt-4"></div>
                        </div>

                        <div>
                            <span className="text-[10px] opacity-40 uppercase tracking-widest block mb-2">Void_Depth_Index</span>
                            <div className="text-6xl font-medium tracking-tighter">0.0042</div>
                            <div className="w-full h-px bg-[#FF3333]/30 mt-4"></div>
                        </div>
                    </div>

                    <div className="mt-auto p-6 border border-[#1A1A1A] bg-[#050505]">
                        <p className="text-[10px] leading-relaxed opacity-60 uppercase font-bold">
                            STATUS_REPORT: <span className="text-[#E5E5E5]">SYSTEM RUNNING AT NOMINAL CAPACITY. ALL NODES RESPONDING. NO UNRECOGNIZED INTERFERENCE DETECTED IN THE LAST 120 CYCLES.</span>
                        </p>
                    </div>
                </section>

                {/* Column 3: Active Transmissions & Terminal */}
                <section className="col-span-4 flex flex-col divide-y divide-[#1A1A1A]">
                    <div className="p-8 flex-1">
                        <h2 className="text-xs font-bold tracking-[0.3em] opacity-40 uppercase mb-8">Active_Transmissions</h2>
                        <div className="space-y-8">
                            {[
                                { status: 'LIVE', label: 'OPERATOR_991 // ENCRYPTED_CHANNEL', sub: 'RECOVERING_FRAGMENT_88...', color: '#660000' },
                                { status: 'IDLE', label: 'OPERATOR_402 // STANDBY', sub: 'WAITING_FOR_SIGNAL_BURST', color: 'transparent' },
                                { status: 'UPLINK', label: 'SYSTEM_CORE // BROADCAST', sub: 'GLOBAL_REPLICA_SYNCING', color: 'transparent' }
                            ].map((trans, idx) => (
                                <div key={idx} className="flex gap-4 items-start group cursor-pointer" onClick={() => onTransmissionClick && onTransmissionClick(trans)}>
                                    <span className={`text-[8px] border border-[#1A1A1A] px-1.5 py-0.5 font-bold tracking-widest ${idx === 0 ? 'bg-[#FF3333] text-white border-[#FF3333]' : 'opacity-40'}`}>
                                        {trans.status}
                                    </span>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-widest mb-1 group-hover:text-[#FF3333] transition-colors">{trans.label}</div>
                                        <div className="text-[9px] opacity-40 tracking-widest uppercase">{trans.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 flex flex-col gap-8">
                        <h2 className="text-xs font-bold tracking-[0.3em] opacity-40 uppercase">Void_Terminal_Output</h2>
                        <div className="bg-[#050505] p-10 text-[10px] leading-relaxed font-mono overflow-hidden border border-[#1A1A1A]">
                            <div className="text-[#FF3333] animate-pulse">&gt; BOOTING_NEXUS_CORE...</div>
                            <div className="opacity-60">&gt; LOAD_MODULE: VOID_BRUTALISM</div>
                            <div className="opacity-60">&gt; CHECKING_INTEGRITY... 100%</div>
                            <div className="opacity-60">&gt; CONNECTING_TO_PEERS... 12,992 FOUND</div>
                            <div className="opacity-60">&gt; ENABLING_HIGH_FIDELITY_TYPOGRAPHY</div>
                            <div className="opacity-60">&gt; READY.</div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Bar Info */}
            <footer className="px-12 py-12 flex justify-between items-center opacity-40 text-[9px] tracking-[0.4em] uppercase border-t border-[#1A1A1A]">
                <div className="flex flex-col gap-1">
                    <span>DESIGN_PROTOCOL: BRUTALIST_MINIMALISM</span>
                    <span>FRAMEWORK: VOID_STACK_V2</span>
                </div>
                <div className="text-center flex flex-col gap-1">
                    <span>UPLINK_STRENGTH: 99.9%</span>
                    <span>LATENCY: 4MS</span>
                </div>
                <div className="text-right flex flex-col gap-1">
                    <span>© 2024 THE_VRINDA_RECORDS</span>
                    <span>ALL_RIGHTS_DECENTRALIZED</span>
                </div>
            </footer>
        </div>
    );
};

export default TheNexus;
