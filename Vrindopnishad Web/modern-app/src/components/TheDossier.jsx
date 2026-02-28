import React from 'react';

/**
 * TheDossier – exact clone of the_airlock_6/code.html
 * Template uses: min-h-screen flex flex-col p-8 md:p-16 lg:p-24
 * Fixed nav with mix-blend-difference, max-w-4xl mx-auto mt-12 space-y-24
 * data-row hover:bg-white hover:text-void, achievement grid with group hover
 */

const TheDossier = () => {
    const [isPurging, setIsPurging] = React.useState(false);

    const handlePurge = () => {
        setIsPurging(true);
        setTimeout(() => setIsPurging(false), 3000);
    };

    return (
        <div className="min-h-screen flex flex-col p-8 md:p-16 lg:p-24">
            {/* Nav – template: fixed top-0 left-0 w-full p-8 z-50 mix-blend-difference */}
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
                <div className="font-mono text-xs tracking-widest text-[#404040]">
                    THE_DOSSIER // PROFILE
                </div>
                <div className="flex gap-8">
                    <a className="font-mono text-xs tracking-widest hover:text-white transition-colors" href="#">[ ARCHIVES ]</a>
                    <a className="font-mono text-xs tracking-widest hover:text-white transition-colors" href="#">[ LOGOUT ]</a>
                </div>
            </nav>

            {/* Main – template: max-w-4xl w-full mx-auto mt-12 space-y-24 */}
            <main className="max-w-4xl w-full mx-auto mt-12 space-y-24">
                {/* Username section */}
                <section className="space-y-4">
                    <div className="flex items-end justify-between border-b border-[#262626] pb-4">
                        <h1 className="font-mono text-4xl md:text-6xl font-light tracking-tighter">OPERATOR_772</h1>
                        <span className="font-mono text-xs text-[#404040] mb-2 uppercase tracking-[0.3em]">Status: Active</span>
                    </div>
                </section>

                {/* Core Parameters + Terminal History – grid-cols-1 md:grid-cols-2 gap-12 */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h2 className="font-display text-xs font-bold tracking-[0.4em] text-[#404040] uppercase">Core_Parameters</h2>
                        <div className="divide-y divide-[#262626] border-t border-b border-[#262626]">
                            {[
                                ['SIGNALS_DECRYPTED', '142'],
                                ['TIME_IN_VOID', '1,240M'],
                                ['TRANSMISSION_STRENGTH', '98.4%'],
                                ['VOID_DEPTH_MAX', '12.4KM'],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex justify-between py-4 px-2 font-mono text-sm transition-all duration-75 hover:bg-white hover:text-[#050505] cursor-default"
                                >
                                    <span>{label}</span>
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-display text-xs font-bold tracking-[0.4em] text-[#404040] uppercase">Terminal_History</h2>
                        <div className="font-mono text-[10px] text-[#404040] leading-relaxed space-y-1">
                            <p>&gt; AUTH_SUCCESS: SESSION_8892</p>
                            <p>&gt; UPLOADING_ENCRYPTED_PACKET... DONE</p>
                            <p>&gt; FRAGMENT_RECOVERY: COMPLETE</p>
                            <p>&gt; SYSTEM_CHECK: NOMINAL</p>
                            <p className="animate-pulse">_</p>
                        </div>
                    </div>
                </section>

                {/* Acquired Knowledge – grid-cols-1 md:grid-cols-2 lg:grid-cols-3 */}
                <section className="space-y-8">
                    <h2 className="font-display text-xs font-bold tracking-[0.4em] text-[#404040] uppercase">Acquired_Knowledge</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-[#262626]">
                        {[
                            { id: '01', cat: 'BRUTALIST', name: 'VOID_DWELLER', desc: 'Survived 1,000+ minutes in absolute silence.' },
                            { id: '02', cat: 'ARCHIVAL', name: 'SIGNAL_HUNTER', desc: 'Successfully decrypted 100 deep-tech signals.' },
                            { id: '03', cat: 'PROTOCOL', name: 'NULL_POINTER', desc: 'Accessed the platform during a total blackout event.' },
                            { id: '04', cat: 'SYNTACTIC', name: 'MONOLITH_EYE', desc: 'Observed the Monolith for 60 consecutive seconds.' },
                            { id: '05', cat: 'DATA', name: 'BYTE_CURATOR', desc: 'Organized over 50 archives into specific datasets.' },
                        ].map((badge) => (
                            <div key={badge.id} className="border-r border-b border-[#262626] p-6 group hover:bg-white transition-colors duration-75">
                                <div className="font-mono text-[10px] text-[#404040] group-hover:text-[#050505] mb-4">{badge.id} // {badge.cat}</div>
                                <h3 className="font-display font-bold text-lg leading-none group-hover:text-[#050505]">{badge.name}</h3>
                                <p className="font-mono text-[11px] text-[#404040] group-hover:text-[#050505] mt-4 leading-relaxed">{badge.desc}</p>
                            </div>
                        ))}
                        <div className="border-r border-b border-[#262626] p-6 flex items-center justify-center opacity-20">
                            <span className="font-mono text-[10px] tracking-widest">[ LOCKED_SLOT ]</span>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-12 border-t border-[#262626]">
                    <button
                        onClick={handlePurge}
                        className={`font-mono text-xs tracking-widest px-4 py-2 transition-all duration-500 border ${isPurging ? 'bg-[#f04242] text-white border-[#f04242]' : 'text-[#f04242] border-transparent hover:bg-[#f04242] hover:text-white'}`}
                    >
                        {isPurging ? '[ PURGE_IN_PROGRESS... ]' : '[ TERMINATE_CONNECTION_AND_PURGE_DATA ]'}
                    </button>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-auto pt-24 pb-12 flex flex-col md:flex-row justify-between items-end border-t border-[#262626]/30">
                <div className="font-mono text-[10px] text-[#404040] space-y-1">
                    <p>LOCATION: SECTOR_7G // ORBITAL_RADIUS_0.0</p>
                    <p>ENCRYPTION: AES-4096-VOID</p>
                </div>
                <div className="text-right font-mono text-[10px] text-[#404040] mt-4 md:mt-0">
                    <p>USER_TOKEN: 0x82...F42A</p>
                    <p>© 2024 THE_VRINDA_RECORDS</p>
                </div>
            </footer>
        </div>
    );
};

export default TheDossier;
