import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWisdom } from '../hooks/useWisdom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const ReadingRoom = () => {
    const { id } = useParams();
    const { getPostById, loading, posts } = useWisdom();
    const post = getPostById(id);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="p-20 text-center font-display">Opening Wisdom...</div>;
    if (!post) return <div className="p-20 text-center font-display">Not Found.</div>;

    const nextPost = posts.find(p => p.id !== post.id);

    return (
        <main className="selection:bg-primary selection:text-white">
            <Helmet>
                <title>{post.title} — Vrindopnishad</title>
            </Helmet>

            {/* Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 h-[2px] bg-primary z-50 origin-left"
                style={{ scaleX, width: '100%' }}
            />

            {/* Shared Nav / Back Button */}
            <header className="fixed top-0 left-0 w-full z-40 p-6 flex items-center justify-between mix-blend-difference text-white pointer-events-none">
                <Link to="/" className="pointer-events-auto flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    <span className="text-sm uppercase tracking-widest font-medium">Return</span>
                </Link>
            </header>

            {/* Cinematic Header / Video Area */}
            <section className="relative w-full h-[819px] bg-cinema-dark flex items-center justify-center sticky top-0 md:relative z-10 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={post.image} 
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                        alt={post.title}
                    />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-transparent z-10"></div>
                {/* Play Button */}
                <button className="relative z-20 w-20 h-20 rounded-full bg-surface-light flex items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/50">
                    <span className="material-symbols-outlined text-4xl text-cinema-dark ml-1 group-hover:text-primary transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
                {/* Overlay Title Block */}
                <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-12 z-20 translate-y-1/4">
                    <div className="max-w-[680px] mx-auto text-center">
                        <p className="text-surface-light/70 text-[13px] uppercase tracking-[2px] font-medium mb-4">{post.topic} · {post.date}</p>
                        <h1 className="text-surface-light font-display text-4xl md:text-6xl lg:text-7xl font-normal leading-tight italic">{post.title}</h1>
                    </div>
                </div>
            </section>

            {/* Transcript / Context Area */}
            <section className="relative z-20 bg-surface-light pt-32 pb-24 px-6 md:px-12">
                <article className="max-w-[680px] mx-auto text-lg leading-[1.8] text-text-main space-y-8">
                    <p className="text-xl md:text-2xl leading-relaxed text-text-muted first-letter:text-5xl first-letter:font-display first-letter:mr-2 first-letter:float-left first-letter:text-cinema-dark">
                        {post.excerpt}
                    </p>
                    <p>
                        Trace the patterns of the mind as they dissolve into the infinite. In the quiet spaces that emerge when the mind finally ceases its endless chatter, we find not emptiness, but a profound presence. 
                    </p>
                    <blockquote className="w-full md:w-[800px] md:-ml-[60px] my-16 py-8 border-l-2 border-primary pl-8 text-3xl md:text-4xl font-display italic leading-snug text-cinema-dark">
                        "Do not seek to stop the thoughts. Seek only to recognize the space in which they appear. The space is who you are."
                    </blockquote>
                    <p>
                        As we cultivate the ability to rest in this silence, we begin to realize that peace is not something we must acquire from the outside world. It is our inherent state, temporarily obscured by the busy mind.
                    </p>
                    <figure className="my-16 w-full md:w-[1000px] md:-ml-[160px]">
                        <img 
                            src={post.image} 
                            className="w-full h-auto rounded-[32px] grayscale hover:grayscale-0 transition-all duration-700 object-cover" 
                            alt={post.title} 
                        />
                        <figcaption className="mt-4 text-center text-[13px] uppercase tracking-[2px] text-text-muted">The observer and the observed merge into one.</figcaption>
                    </figure>
                </article>
            </section>

            {/* Next Journey Block */}
            {nextPost && (
                <Link to={`/post/${nextPost.id}`} className="block bg-cinema-dark text-surface-light py-24 px-6 md:px-12 text-center group cursor-pointer border-t border-white/10">
                    <div className="max-w-[680px] mx-auto">
                        <p className="text-[13px] uppercase tracking-[2px] text-surface-light/50 mb-6">Next Journey</p>
                        <h2 className="font-display text-4xl md:text-5xl italic group-hover:text-primary transition-colors duration-300">{nextPost.title}</h2>
                        <div className="mt-12 flex justify-center">
                            <div className="w-12 h-12 rounded-full border border-surface-light/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-300">
                                <span className="material-symbols-outlined text-xl">arrow_downward</span>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </main>
    )
}

export default ReadingRoom
