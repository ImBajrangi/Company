import React from 'react';
import { Download, Share2, Eye, Cpu } from 'lucide-react';

const Gallery = ({ items = [] }) => {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border-thin pb-8 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-signal-green" />
                        <span className="font-mono-meta text-[10px] text-signal-green uppercase tracking-widest">VISUAL_SYNC: NOMINAL</span>
                    </div>
                    <h2 className="text-3xl font-mono-ui font-medium uppercase tracking-tight text-text-primary">Visual_Archives</h2>
                </div>
                <p className="font-mono-meta text-[10px] text-text-muted uppercase tracking-widest">TOTAL_RECORDS: {items.length} // CLUSTER: 04</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item, index) => (
                    <div key={index} className="group relative flex flex-col bg-bg-void hover:-translate-y-1 transition-all duration-300">
                        {/* Sci-Fi Folder Card Shape */}
                        <div className="absolute inset-0 border border-border-thin group-hover:border-accent-holo/50 transition-colors chamfer-clip-folder pointer-events-none"></div>

                        <div className="relative aspect-[3/4] overflow-hidden m-2 chamfer-clip">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-bg-void/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button className="bg-text-primary text-bg-deep size-9 chamfer-clip flex items-center justify-center hover:scale-110 transition-transform">
                                    <Download size={16} />
                                </button>
                                <button className="bg-text-primary text-bg-deep size-9 chamfer-clip flex items-center justify-center hover:scale-110 transition-transform">
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-5 pt-0 flex flex-col gap-4 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-mono-ui text-sm font-bold uppercase tracking-tight text-text-primary group-hover:text-accent-holo transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="font-mono-meta text-[10px] text-text-muted mt-1 uppercase">ID: 0x{index + 1}FA // {item.category}</p>
                                </div>
                                <button className="text-text-muted hover:text-accent-holo transition-colors">
                                    <Eye size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
