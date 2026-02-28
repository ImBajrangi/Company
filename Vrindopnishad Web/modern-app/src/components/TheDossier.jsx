import React from 'react';
import { useMobile } from '../hooks/useMobile';

/**
 * TheDossier – Desktop: exact clone of the_airlock_6/code.html
 *              Mobile:  exact clone of the_airlock_8/code.html
 */

const KNOWLEDGE_ITEMS = [
    { type: 'Database_Fragment', name: 'VOID_ARCHIVE_X01' },
    { type: 'Neural_Log', name: 'SYNAPTIC_OVERLOAD_4' },
    { type: 'Visual_Data', name: 'MONOLITH_STRUCTURE_RAW' },
    { type: 'Audio_Feed', name: 'GHOST_SIGNAL_RECON' },
];

const BADGES = [
    { id: '01', cat: 'BRUTALIST', name: 'VOID_DWELLER', desc: 'Survived 1,000+ minutes in absolute silence.' },
    { id: '02', cat: 'ARCHIVAL', name: 'SIGNAL_HUNTER', desc: 'Successfully decrypted 100 deep-tech signals.' },
    { id: '03', cat: 'PROTOCOL', name: 'NULL_POINTER', desc: 'Accessed the platform during a total blackout event.' },
    { id: '04', cat: 'SYNTACTIC', name: 'MONOLITH_EYE', desc: 'Observed the Monolith for 60 consecutive seconds.' },
    { id: '05', cat: 'DATA', name: 'BYTE_CURATOR', desc: 'Organized over 50 archives into specific datasets.' },
];

/* ========== MOBILE – airlock_8 ========== */
const DossierMobile = () => {
    return (
        <div className="bg-[#000] text-white font-mono antialiased overflow-x-hidden min-h-screen flex flex-col selection:bg-[#f04242] selection:text-[#050505]">
            {/* Sticky nav */}
            <nav className="sticky top-0 bg-[#000]/80 backdrop-blur-md border-b border-[#1A1A1A] z-40 px-6 py-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[9px] text-[#555] tracking-[0.3em] uppercase">Status: Connected</span>
                    <span className="text-[11px] text-[#f04242] font-bold">DEEP_VOID // ACCESS_GRANTED</span>
                </div>
                <button className="material-symbols-outlined text-white scale-90">menu</button>
            </nav>

            {/* Main content */}
            <main className="px-6 py-8 pb-32 max-w-md mx-auto w-full">
                {/* Operator Identity */}
                <header className="mb-12">
                    <div className="inline-block border-l-2 border-[#f04242] pl-4 mb-4">
                        <span className="text-[10px] text-[#555] tracking-[0.4em] uppercase">Operator Identity</span>
                        <h1 className="text-4xl font-extrabold tracking-tighter mt-1">OPERATOR_772</h1>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#555]">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#f04242] rounded-full" /> ENCRYPTED
                        </span>
                        <span>LOC: SECTOR_04</span>
                    </div>
                </header>

                {/* 2x2 Stats Grid */}
                <section className="grid grid-cols-2 border-t border-l border-[#1A1A1A] mb-12">
                    {[
                        { label: 'Signals', value: '1,402', unit: 'HZ' },
                        { label: 'Depth', value: '14.0', unit: 'KM' },
                        { label: 'Weight', value: '94.2', unit: 'W' },
                        { label: 'Sync', value: '99.9', unit: '%' },
                    ].map(stat => (
                        <div key={stat.label} className="border-r border-b border-[#1A1A1A] p-5">
                            <span className="text-[9px] text-[#555] tracking-widest uppercase block mb-2">{stat.label}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">{stat.value}</span>
                                <span className="text-[10px] text-[#f04242]">{stat.unit}</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Acquired Knowledge – white card rows */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Acquired_Knowledge</h3>
                        <span className="text-[9px] text-[#555] font-bold">TOTAL_08</span>
                    </div>
                    <div className="space-y-2">
                        {KNOWLEDGE_ITEMS.map(item => (
                            <div key={item.name} className="group bg-white text-[#050505] p-4 flex justify-between items-center transition-all active:scale-95">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold tracking-widest uppercase opacity-60">{item.type}</span>
                                    <span className="text-sm font-extrabold tracking-tight">{item.name}</span>
                                </div>
                                <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
                            </div>
                        ))}
                        {/* Locked entry */}
                        <div className="bg-[#1A1A1A] border border-dashed border-[#555]/30 p-4 flex justify-between items-center opacity-50">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold tracking-widest uppercase text-[#555]">Classified</span>
                                <span className="text-sm font-extrabold tracking-tight text-[#555]">FRAGMENT_LOCKED</span>
                            </div>
                            <span className="material-symbols-outlined text-lg text-[#555]">lock</span>
                        </div>
                    </div>
                </section>

                {/* Terminal footer */}
                <div className="mt-16 pt-8 border-t border-[#1A1A1A]">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-[#555] uppercase">Terminal Ver</span>
                            <span className="text-[10px] text-white">V.1.04.88</span>
                        </div>
                        <div className="w-full bg-[#1A1A1A] h-1 relative">
                            <div className="absolute top-0 left-0 h-full bg-[#f04242] w-2/3" />
                        </div>
                        <p className="text-[9px] text-[#555] leading-relaxed uppercase tracking-tighter">
                            Warning: Dossier access is monitored. Any unauthorized extraction of knowledge fragments will result in neural disconnect.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

/* ========== DESKTOP – airlock_6 ========== */
const DossierDesktop = () => {
    const [isPurging, setIsPurging] = React.useState(false);

    const handlePurge = () => {
        setIsPurging(true);
        setTimeout(() => setIsPurging(false), 3000);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '96px 64px 48px 64px' }}>
            {/* Main */}
            <main style={{ maxWidth: '896px', width: '100%', margin: '0 auto' }}>
                {/* Username */}
                <section style={{ marginBottom: '96px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid #262626', paddingBottom: '16px' }}>
                        <h1 className="font-mono" style={{ fontSize: '3.75rem', fontWeight: 300, letterSpacing: '-0.05em', lineHeight: 1 }}>OPERATOR_772</h1>
                        <span className="font-mono" style={{ fontSize: '12px', color: '#404040', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>Status: Active</span>
                    </div>
                </section>

                {/* Core Parameters + Terminal History */}
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '96px' }}>
                    <div>
                        <h2 className="font-display" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.4em', color: '#404040', textTransform: 'uppercase', marginBottom: '24px' }}>Core_Parameters</h2>
                        <div style={{ borderTop: '1px solid #262626', borderBottom: '1px solid #262626' }}>
                            {[
                                ['SIGNALS_DECRYPTED', '142'],
                                ['TIME_IN_VOID', '1,240M'],
                                ['TRANSMISSION_STRENGTH', '98.4%'],
                                ['VOID_DEPTH_MAX', '12.4KM'],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="font-mono"
                                    style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        padding: '16px 8px', fontSize: '14px',
                                        borderBottom: '1px solid #262626',
                                        cursor: 'default', transition: 'all 0.075s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#E5E5E5'; e.currentTarget.style.color = '#050505'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
                                >
                                    <span>{label}</span>
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-display" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.4em', color: '#404040', textTransform: 'uppercase', marginBottom: '24px' }}>Terminal_History</h2>
                        <div className="font-mono" style={{ fontSize: '10px', color: '#404040', lineHeight: 1.8 }}>
                            <p>&gt; AUTH_SUCCESS: SESSION_8892</p>
                            <p>&gt; UPLOADING_ENCRYPTED_PACKET... DONE</p>
                            <p>&gt; FRAGMENT_RECOVERY: COMPLETE</p>
                            <p>&gt; SYSTEM_CHECK: NOMINAL</p>
                            <p className="animate-pulse">_</p>
                        </div>
                    </div>
                </section>

                {/* Acquired Knowledge */}
                <section style={{ marginBottom: '96px' }}>
                    <h2 className="font-display" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.4em', color: '#404040', textTransform: 'uppercase', marginBottom: '32px' }}>Acquired_Knowledge</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderLeft: '1px solid #262626', borderTop: '1px solid #262626' }}>
                        {BADGES.map(badge => (
                            <div
                                key={badge.id}
                                style={{ borderRight: '1px solid #262626', borderBottom: '1px solid #262626', padding: '24px', transition: 'all 0.075s', cursor: 'default' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.querySelectorAll('*').forEach(el => el.style.color = '#050505'); }}
                                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.querySelectorAll('*').forEach(el => el.style.color = ''); }}
                            >
                                <div className="font-mono" style={{ fontSize: '10px', color: '#404040', marginBottom: '16px' }}>{badge.id} // {badge.cat}</div>
                                <h3 className="font-display" style={{ fontWeight: 700, fontSize: '18px', lineHeight: 1 }}>{badge.name}</h3>
                                <p className="font-mono" style={{ fontSize: '11px', color: '#404040', marginTop: '16px', lineHeight: 1.6 }}>{badge.desc}</p>
                            </div>
                        ))}
                        <div style={{ borderRight: '1px solid #262626', borderBottom: '1px solid #262626', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                            <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.3em' }}>[ LOCKED_SLOT ]</span>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section style={{ paddingTop: '48px', borderTop: '1px solid #262626' }}>
                    <button
                        onClick={handlePurge}
                        className="font-mono"
                        style={{
                            fontSize: '12px', letterSpacing: '0.3em', padding: '8px 16px',
                            color: isPurging ? 'white' : '#f04242',
                            background: isPurging ? '#f04242' : 'transparent',
                            border: isPurging ? '1px solid #f04242' : '1px solid transparent',
                            cursor: 'pointer', transition: 'all 0.5s'
                        }}
                        onMouseEnter={e => { if (!isPurging) { e.currentTarget.style.background = '#f04242'; e.currentTarget.style.color = 'white'; } }}
                        onMouseLeave={e => { if (!isPurging) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04242'; } }}
                    >
                        {isPurging ? '[ PURGE_IN_PROGRESS... ]' : '[ TERMINATE_CONNECTION_AND_PURGE_DATA ]'}
                    </button>
                </section>
            </main>

            {/* Footer */}
            <footer className="font-mono" style={{ marginTop: 'auto', paddingTop: '96px', paddingBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(38,38,38,0.3)' }}>
                <div style={{ fontSize: '10px', color: '#404040' }}>
                    <p>LOCATION: SECTOR_7G // ORBITAL_RADIUS_0.0</p>
                    <p>ENCRYPTION: AES-4096-VOID</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#404040' }}>
                    <p>USER_TOKEN: 0x82...F42A</p>
                    <p>© 2024 THE_VRINDA_RECORDS</p>
                </div>
            </footer>
        </div>
    );
};

/* ========== MAIN EXPORT ========== */
const TheDossier = () => {
    const isMobile = useMobile();
    return isMobile ? <DossierMobile /> : <DossierDesktop />;
};

export default TheDossier;
