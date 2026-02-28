import React, { useState } from 'react';

/**
 * TheSignal component – from the_signal/screen.png reference.
 * Command-palette / Search interface.
 */
const TheSignal = ({ onClose, onSelection }) => {
    const [query, setQuery] = useState('https://w');

    const records = [
        { id: '01', title: 'The Architecture of Silence', date: '24.10.2023', readTime: '12 MIN READ', status: 'READING' },
        { id: '02', title: 'Brutalist Web Design Principles', date: '12.10.2023', readTime: '8 MIN READ', status: '' },
        { id: '03', title: 'Deep Work vs Shallow Work', date: '08.09.2023', readTime: '15 MIN READ', status: '' },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-white p-6">
            <div className="w-full max-w-4xl">
                {/* Input Area */}
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl text-[#E5E5E5] opacity-40">&gt;</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-transparent text-5xl font-bold border-none outline-none flex-1 tracking-tighter"
                        autoFocus
                    />
                    <div className="flex items-center gap-2 text-[#FF3333] font-bold text-sm tracking-widest whitespace-nowrap">
                        <span className="animate-pulse">→</span> [ ENTER TO CAPTURE ]
                    </div>
                </div>

                {/* Sub-header */}
                <div className="flex justify-between items-center py-2 border-t border-[#FF3333]/30 mb-12">
                    <span className="text-[10px] tracking-[0.2em] text-[#FF3333]">SIGNAL STATUS: <span className="font-bold">ACTIVE</span></span>
                    <span className="text-[10px] tracking-[0.2em] opacity-40 uppercase">Protocol detected: HTTPS</span>
                </div>

                {/* Matching Records */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] opacity-40 mb-2">
                        <span className="tracking-[0.2em] uppercase">Matching Records</span>
                        <span>3 FOUND</span>
                    </div>

                    <div className="space-y-px">
                        {records.map((record) => (
                            <div
                                key={record.id}
                                onClick={() => onSelection && onSelection(record)}
                                className={`group p-6 flex items-start gap-8 cursor-pointer transition-all ${record.status === 'READING' ? 'bg-white/5 border-l-2 border-[#FF3333]' : 'hover:bg-white/5 opacity-40 hover:opacity-100'}`}
                            >
                                <span className={`text-base font-bold ${record.status === 'READING' ? 'text-[#FF3333]' : 'opacity-40'}`}>
                                    {record.id}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-1">
                                        <h3 className="text-2xl font-medium tracking-tight uppercase">{record.title}</h3>
                                        {record.status && (
                                            <span className="text-[10px] bg-[#FF3333] text-white px-2 py-0.5 font-bold tracking-widest uppercase">
                                                {record.status}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-6 text-[10px] opacity-40 uppercase tracking-widest">
                                        <span>{record.date}</span>
                                        <span>{record.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="fixed bottom-12 left-0 right-0 px-12 flex justify-between items-center opacity-30 text-[10px] tracking-[0.2em] uppercase">
                    <div className="flex gap-12">
                        <button onClick={onClose} className="flex items-center gap-3 hover:opacity-100 transition-opacity">
                            <span className="border border-white/40 px-1.5 py-0.5 rounded-sm">ESC</span>
                            Close Signal
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="border border-white/40 px-1.5 py-0.5 rounded-sm">↑↓</span>
                            Navigate
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="border border-white/40 px-1.5 py-0.5 rounded-sm">↵</span>
                        Open Selection
                    </div>
                </div>
            </div>

            {/* Background noise can be added here */}
        </div>
    );
};

export default TheSignal;
