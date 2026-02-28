import React from 'react';

/**
 * TheSplash – exact clone of the_airlock_21/code.html
 * Full-screen "Enter the Void" splash with blinking cursor, red glow on hover,
 * manifesto text, and bottom status bar.
 */
const TheSplash = ({ onEnter }) => {
    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] text-[#E5E5E5] h-screen w-full overflow-hidden flex flex-col items-center justify-center font-display antialiased selection:bg-[#333333] selection:text-white">
            {/* Noise overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgyjEX08k7rB7INFaC2eR0OFlcunjJch52-aMNk4W7Tf9Y1XQXxbWjcXDHYPyd8Huv-rsCrxgv-cLYQ0lTbbS3Q7uPwwHslf25wEUQHXcBdWj4ndec1fLaZfyG9qmNAMz1hkrPBayyQfsCnPxE7tmf28BIVdmUk9xzEQK49q8eHkV_6CY4Id2Tw3VmsLSzX-23smiTJOyAFBCl0IMzdTnA0dbyTjR2hMGLshbq9THOKlt7MBxI8diKfI1Ry6L_cOGPTRY-xugXHH0')",
                }}
            />

            {/* Main Container */}
            <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6 gap-12">
                {/* The Monolith / Cursor */}
                <div className="flex flex-col items-center gap-6 group">
                    <div className="relative">
                        {/* Glowing red aura behind cursor */}
                        <div className="absolute -inset-4 bg-[#f04242]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <h1
                            className="text-6xl md:text-8xl font-bold tracking-tighter text-[#E5E5E5] select-none"
                            style={{ animation: 'blink 1.5s steps(2, start) infinite' }}
                        >
                            _
                        </h1>
                    </div>
                    {/* Manifesto (fades in on hover) */}
                    <div className="h-16 flex items-center justify-center">
                        <p className="text-[#404040] text-sm md:text-base font-normal text-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                            Silence is a luxury. Read in peace.
                        </p>
                    </div>
                </div>

                {/* Entrance CTA */}
                <button
                    onClick={onEnter}
                    className="relative group/btn overflow-hidden border border-[#404040] hover:border-[#E5E5E5] bg-transparent hover:bg-white transition-colors duration-0 w-full max-w-[320px] h-14 flex items-center justify-center"
                >
                    <span className="font-display font-bold text-sm tracking-[0.2em] text-[#E5E5E5] group-hover/btn:text-[#050505] uppercase transition-colors duration-0">
                        [ Enter The Void ]
                    </span>
                    {/* Red flash on active */}
                    <div className="absolute inset-0 bg-[#f04242] translate-y-full group-active/btn:translate-y-0 transition-transform duration-150" />
                </button>
            </main>

            {/* Footer / Status */}
            <footer className="fixed bottom-8 w-full px-8 flex justify-between items-end text-[10px] md:text-xs font-mono text-[#404040] uppercase tracking-widest opacity-40">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f04242] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                    <span>System Status: Online</span>
                </div>
                <div className="text-right hidden md:block">
                    <span>v.1.0.4 // Void Protocol</span>
                </div>
            </footer>

            {/* Decorative Top Right Corner */}
            <div className="fixed top-8 right-8 text-[#404040] opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-help">
                <span className="material-symbols-outlined text-2xl">encrypted</span>
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default TheSplash;
