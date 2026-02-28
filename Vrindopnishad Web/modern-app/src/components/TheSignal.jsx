import React, { useState, useEffect } from 'react';

/**
 * TheSignal – search/command overlay.
 * exact clone of the_signal/code.html
 * Search input with > prompt, results list, keyboard legend footer.
 * Positioned in upper-center area with blurred background.
 */
const TheSignal = ({ onClose, onSelection }) => {
    const [query, setQuery] = useState('');

    const records = [
        { id: '01', title: 'The Architecture of Silence', date: '24.10.2023', readTime: '12 MIN READ', status: 'READING' },
        { id: '02', title: 'Brutalist Web Design Principles', date: '12.10.2023', readTime: '8 MIN READ', status: '' },
        { id: '03', title: 'Deep Work vs Shallow Work', date: '08.09.2023', readTime: '15 MIN READ', status: '' },
    ];

    // ESC to close
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#050505]/90 backdrop-blur-[5px] flex flex-col font-display text-white">
            {/* Background content (faded) – template has archive rows behind */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 select-none" aria-hidden="true">
                <div className="w-[60px] border-r border-[#262626] h-full hidden md:flex flex-col items-center py-8 gap-8">
                    <span className="material-symbols-outlined text-[#404040]">all_inclusive</span>
                    <span className="material-symbols-outlined text-[#404040]">search</span>
                    <span className="material-symbols-outlined text-[#404040]">settings</span>
                </div>
            </div>

            {/* Close button — mobile */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:hidden text-[#404040] hover:text-white text-2xl z-50"
            >
                ✕
            </button>

            {/* Main Container — positioned upper area, not dead center */}
            <div className="relative z-50 w-full max-w-4xl mx-auto px-5 md:px-8 pt-[15vh] md:pt-[20vh] flex flex-col">
                {/* Command Input Area */}
                <div className="relative group mb-8 md:mb-12">
                    <div className="flex items-end gap-3 md:gap-4 border-b border-transparent focus-within:border-[#f04242]/50 transition-colors duration-300 pb-2">
                        {/* Prompt symbol */}
                        <span className="text-3xl md:text-4xl text-[#404040] select-none pb-1">&gt;</span>
                        {/* Input */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Paste URL or search archives..."
                                className="w-full bg-transparent border-none p-0 text-2xl md:text-4xl font-bold text-[#E5E5E5] placeholder:text-[#404040]/30 focus:ring-0 focus:outline-none font-display tracking-tight"
                                style={{ caretColor: '#f04242' }}
                                autoFocus
                            />
                        </div>
                        {/* Action feedback */}
                        <div className="hidden md:flex items-center gap-3 animate-pulse flex-shrink-0">
                            <span className="text-[#f04242] material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                            <span className="text-[#f04242] font-mono text-sm tracking-widest">[ ENTER TO CAPTURE ]</span>
                        </div>
                    </div>
                    {/* Status Line */}
                    <div className="flex justify-between mt-2 font-mono text-xs text-[#404040] uppercase tracking-wider">
                        <span>Signal Status: <span className="text-[#f04242]">Active</span></span>
                        <span className="opacity-50">Protocol Detected: HTTPS</span>
                    </div>
                </div>

                {/* Results List */}
                <div className="flex flex-col w-full">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4 pb-2 border-b border-[#262626]">
                        <span className="font-mono text-xs text-[#404040] uppercase tracking-widest">Matching Records</span>
                        <span className="h-px flex-1 bg-[#262626]" />
                        <span className="font-mono text-xs text-[#404040]">{records.length} FOUND</span>
                    </div>
                    {/* Items */}
                    <ul className="flex flex-col gap-1">
                        {records.map((record, idx) => (
                            <li key={record.id} className="group cursor-pointer" onClick={() => onSelection && onSelection(record)}>
                                <div className={`flex items-center py-3 px-4 -mx-4 transition-colors ${record.status === 'READING'
                                        ? 'bg-[#404040]/10 border-l-2 border-[#f04242]'
                                        : 'hover:bg-white/5 border-l-2 border-transparent hover:border-[#404040]'
                                    }`}>
                                    <span className={`font-mono mr-4 text-xs ${record.status === 'READING' ? 'text-[#f04242]' : 'text-[#404040]'}`}>
                                        {record.id}
                                    </span>
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <span className="flex flex-wrap items-center gap-2">
                                            <span className={`text-base md:text-lg font-display leading-tight ${record.status === 'READING' ? 'text-[#E5E5E5]' : 'text-[#404040] group-hover:text-[#E5E5E5]'
                                                } group-hover:underline decoration-1 underline-offset-4`}>
                                                {record.title}
                                            </span>
                                            {record.status && (
                                                <span className="text-[#f04242] bg-[#f04242]/10 px-1 text-[10px] font-mono uppercase tracking-wide">
                                                    {record.status}
                                                </span>
                                            )}
                                        </span>
                                        <div className="flex gap-4 mt-1">
                                            <span className="font-mono text-xs text-[#404040]">{record.date}</span>
                                            <span className="font-mono text-xs text-[#404040]">{record.readTime}</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-[#E5E5E5] opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">subdirectory_arrow_left</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Keyboard Legend Footer — fixed at bottom */}
            <div className="absolute bottom-8 md:bottom-12 left-0 right-0 w-full max-w-4xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between font-mono text-xs text-[#404040] gap-3">
                <div className="flex gap-4 md:gap-6">
                    <button onClick={onClose} className="flex items-center gap-2 hover:text-white transition-colors">
                        <span className="border border-[#262626] px-1.5 py-0.5 rounded-sm min-w-[24px] text-center bg-[#050505] text-[9px]">ESC</span>
                        <span>CLOSE SIGNAL</span>
                    </button>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="border border-[#262626] px-1.5 py-0.5 rounded-sm min-w-[24px] text-center bg-[#050505]">↑↓</span>
                        <span>NAVIGATE</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="border border-[#262626] px-1.5 py-0.5 rounded-sm min-w-[24px] text-center bg-[#050505]">↵</span>
                    <span>OPEN SELECTION</span>
                </div>
            </div>
        </div>
    );
};

export default TheSignal;
