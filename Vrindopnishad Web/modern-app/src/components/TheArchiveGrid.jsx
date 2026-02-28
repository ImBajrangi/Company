import React from 'react';

/**
 * TheArchiveGrid – exact clone of the_airlock_4/code.html
 * Template uses: min-h-screen, fixed nav (top-0 z-[60]), left aside (w-10 hidden lg:flex),
 * main (pt-16 lg:pl-10), grid auto-fill minmax(120px,1fr), 120 cells,
 * footer, corner brackets, scanline overlays
 */

const IMAGES = [
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1446776899648-aa78eefe8512?auto=format&fit=crop&q=80&w=300',
];

const TheArchiveGrid = () => {
    const cells = Array.from({ length: 120 }, (_, i) => i + 1);

    return (
        <div className="min-h-screen relative">
            {/* Top nav – template: fixed top-0 left-0 w-full p-4 z-[60] bg-void/90 backdrop-blur-md border-b */}
            <nav className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-[60] bg-[#050505]/90 backdrop-blur-md border-b border-[#1a1a1a]">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-[#f04242]" />
                    <div className="font-mono text-[10px] tracking-[0.4em] text-[#E5E5E5] uppercase font-bold">
                        DEEP_VOID / ARCHIVE_ACCESS
                    </div>
                </div>
                <div className="flex gap-8">
                    <a className="font-mono text-[10px] tracking-widest text-[#666666] hover:text-[#f04242] transition-colors" href="#">DIRECTORY</a>
                    <a className="font-mono text-[10px] tracking-widest text-[#666666] hover:text-[#f04242] transition-colors" href="#">TRANSMISSIONS</a>
                    <a className="font-mono text-[10px] tracking-widest text-white border-b border-[#f04242] pb-1" href="#">VISUAL_GRID</a>
                </div>
            </nav>

            {/* Left aside – template: fixed left-0 top-0 h-full w-10 hidden lg:flex */}
            <aside className="fixed left-0 top-0 h-full w-10 border-r border-[#1a1a1a] hidden lg:flex flex-col items-center justify-between py-24 z-40 pointer-events-none">
                <div className="rotate-90 font-mono text-[9px] text-[#666666] tracking-[0.4em] whitespace-nowrap opacity-40">
                    LAT: 52.3676° N
                </div>
                <div className="rotate-90 font-mono text-[9px] text-[#f04242] tracking-[0.4em] whitespace-nowrap uppercase font-bold">
                    Grid_Active
                </div>
                <div className="rotate-90 font-mono text-[9px] text-[#666666] tracking-[0.4em] whitespace-nowrap opacity-40">
                    LNG: 4.9041° E
                </div>
            </aside>

            {/* Main – template: pt-16 lg:pl-10 */}
            <main className="pt-16 lg:pl-10">
                {/* Header */}
                <header className="px-6 py-8 border-b border-[#1a1a1a] flex flex-col md:flex-row justify-between items-end gap-6 bg-[#0a0a0a]">
                    <div className="space-y-1">
                        <h1 className="font-mono text-2xl md:text-3xl font-bold tracking-tighter uppercase text-white">
                            The_Archive_Grid
                        </h1>
                        <p className="font-mono text-[10px] text-[#666666] uppercase tracking-[0.2em]">
                            Visual Telemetry Mode // Sector: Deep_Space_Core
                        </p>
                    </div>
                    <div className="flex items-center gap-12 font-mono text-[9px] text-[#666666]">
                        <div className="flex flex-col items-start border-l border-[#1a1a1a] pl-4">
                            <span className="text-white opacity-40">DATA_DENSITY</span>
                            <span className="text-white">ULTRA_HIGH</span>
                        </div>
                        <div className="flex flex-col items-start border-l border-[#1a1a1a] pl-4">
                            <span className="text-white opacity-40">INDEXED_CELLS</span>
                            <span className="text-white">2,048 UNITS</span>
                        </div>
                        <div className="flex flex-col items-start border-l border-[#f04242] pl-4">
                            <span className="text-[#f04242] font-bold">CONNECTION</span>
                            <span className="text-[#f04242] animate-pulse">ENCRYPTED</span>
                        </div>
                    </div>
                </header>

                {/* Grid – template: auto-fill minmax(120px,1fr) */}
                <div
                    className="border-t border-l border-[#1a1a1a]"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        width: '100%',
                    }}
                >
                    {cells.map((i) => {
                        const id = String(i).padStart(3, '0');
                        const img = IMAGES[i % IMAGES.length];
                        return (
                            <div
                                key={i}
                                className="relative overflow-hidden bg-[#0a0a0a] border-r border-b border-[#1a1a1a]/60 group transition-all duration-300"
                                style={{ aspectRatio: '1/1' }}
                            >
                                <img
                                    src={img}
                                    alt={`TR_${id}`}
                                    className="w-full h-full object-cover grayscale brightness-75 contrast-125 opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:brightness-100 group-hover:opacity-100"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-[#f04242]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <div className="w-1/2 h-1/2 border border-[#f04242]/20" />
                                </div>
                                {/* Cell ID label */}
                                <div className="absolute top-0 left-0 bg-[#050505] px-1 py-0.5 z-20 opacity-0 group-hover:opacity-100 transition-all -translate-x-full group-hover:translate-x-0">
                                    <span className="font-mono text-[8px] text-[#f04242] font-bold">TS_{id}</span>
                                </div>
                                {/* Focus icon */}
                                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                                    <span className="material-symbols-outlined text-[10px] text-[#f04242]">filter_center_focus</span>
                                </div>
                                {/* Cell border */}
                                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Footer – template: lg:pl-10 border-t p-6 */}
            <footer className="lg:pl-10 border-t border-[#1a1a1a] bg-[#050505] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-1 font-mono">
                    <button className="text-[9px] px-3 py-1.5 border border-[#1a1a1a] hover:bg-white hover:text-[#050505] transition-all uppercase tracking-widest">
                        Prev_Sector
                    </button>
                    <div className="px-4 text-[9px] text-[#666666] tracking-widest">
                        PAGE [ 01 / 64 ]
                    </div>
                    <button className="text-[9px] px-3 py-1.5 border border-[#1a1a1a] hover:bg-white hover:text-[#050505] transition-all uppercase tracking-widest">
                        Next_Sector
                    </button>
                </div>
                <div className="flex items-center gap-10">
                    <div className="font-mono text-[9px] text-[#666666] space-y-0.5 text-right hidden sm:block">
                        <p>UI_OVERLAY: v.4.0.2</p>
                        <p>DATA_STREAM: STABLE</p>
                    </div>
                    <div className="h-6 w-px bg-[#1a1a1a]" />
                    <div className="text-right font-mono text-[9px] text-[#666666] uppercase">
                        <p>© DEEP_VOID_ARCHIVE</p>
                        <p className="text-[#f04242] font-bold">TERMINAL_SECURE</p>
                    </div>
                </div>
            </footer>

            {/* Scanline overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.05] z-[99]"
                style={{
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.4) 50%)',
                    backgroundSize: '100% 2px',
                }}
            />

            {/* Corner brackets */}
            <div className="fixed top-0 left-0 p-2 lg:p-4 pointer-events-none z-[70]">
                <div className="w-8 h-8 border-t border-l border-[#f04242]/40" />
            </div>
            <div className="fixed top-0 right-0 p-2 lg:p-4 pointer-events-none z-[70]">
                <div className="w-8 h-8 border-t border-r border-[#f04242]/40" />
            </div>
            <div className="fixed bottom-0 left-0 p-2 lg:p-4 pointer-events-none z-[70]">
                <div className="w-8 h-8 border-b border-l border-[#f04242]/40" />
            </div>
            <div className="fixed bottom-0 right-0 p-2 lg:p-4 pointer-events-none z-[70]">
                <div className="w-8 h-8 border-b border-r border-[#f04242]/40" />
            </div>

            {/* Transmitting text */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] text-[#666666] tracking-[1em] uppercase opacity-20 pointer-events-none z-50">
                Sector_Zero_Transmitting...
            </div>
        </div>
    );
};

export default TheArchiveGrid;
