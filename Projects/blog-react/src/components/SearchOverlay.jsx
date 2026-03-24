import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWisdom } from '../hooks/useWisdom'

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const { posts } = useWisdom();

    const results = query.length > 2 
        ? posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
        : [];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-[#0A0A0A]/95 backdrop-blur-3xl z-[2000] flex items-start justify-center pt-[15vh]"
                >
                    <button onClick={onClose} className="absolute top-10 right-10 text-white/40 hover:text-[#d4af37] transition-all">
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>
                    
                    <div className="w-full max-w-[900px] px-8">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Seek Divine Wisdom..." 
                                className="w-full bg-transparent border-none border-b border-white/10 py-10 text-5xl md:text-7xl font-normal italic text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/10"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="absolute right-0 bottom-10 text-[#d4af37]">
                                <span className="material-symbols-outlined text-4xl">travel_explore</span>
                            </div>
                        </motion.div>
                        
                        <div className="mt-16 space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scroll">
                            {results.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link 
                                        to={`/post/${post.id}`} 
                                        onClick={onClose}
                                        className="flex items-center justify-between group py-8 px-8 bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-3xl transition-all duration-500"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[#d4af37] text-[10px] uppercase tracking-[0.3em] font-bold">{post.topic}</span>
                                            <h4 className="text-3xl font-normal group-hover:italic group-hover:text-white transition-all">
                                                {post.title}
                                            </h4>
                                        </div>
                                        <span className="material-symbols-outlined text-[#d4af37] opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">east</span>
                                    </Link>
                                </motion.div>
                            ))}
                            {query.length > 2 && results.length === 0 && (
                                <p className="text-white/30 text-xl font-serif italic text-center py-20">The archive remains silent on this inquiry.</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SearchOverlay
