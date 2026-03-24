import React from 'react'
import { Link } from 'react-router-dom'
import { useWisdom } from '../hooks/useWisdom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const HomeArchive = () => {
    const { posts, loading } = useWisdom();

    if (loading) return <div className="flex items-center justify-center min-h-[60vh] font-display italic text-text-muted">Awakening archives...</div>;

    const featuredPost = posts.find(p => p.featured);
    const archivePosts = posts.filter(p => !p.featured);

    return (
        <main className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-[120px] pb-32 pt-10">
            <Helmet>
                <title>Vrindopnishad — Home Archive</title>
            </Helmet>

            {/* Featured Marquee */}
            {featuredPost && (
                <section className="mb-32 cursor-pointer group">
                    <Link to={`/post/${featuredPost.id}`} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-auto lg:h-[600px]">
                        <div className="lg:col-span-8 h-[400px] lg:h-full w-full overflow-hidden rounded-full order-2 lg:order-1">
                            <img 
                                alt={featuredPost.title} 
                                className="w-full h-full object-cover grayscale-img transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                                src={featuredPost.image} 
                            />
                        </div>
                        <div className="lg:col-span-4 flex flex-col justify-center order-1 lg:order-2 pl-0 lg:pl-8">
                            <p className="text-primary text-[13px] font-medium tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-primary"></span>
                                {featuredPost.date} · {featuredPost.topic}
                            </p>
                            <h1 className="text-5xl md:text-[72px] font-normal leading-[1.1] text-[#0A0A0A] mb-8 title-hover-italic font-display">
                                {featuredPost.title}
                            </h1>
                            <p className="text-[#8C8C8C] text-lg leading-[1.8] mb-8 line-clamp-3">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-3 text-sm font-medium text-[#0A0A0A] group-hover:text-primary transition-colors">
                                <span>Begin Journey</span>
                                <span className="material-symbols-outlined text-sm transform group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#E0E0E0] mb-24 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#FAFAFA] px-4 text-[#8C8C8C] text-[13px] tracking-[0.2em] uppercase">
                    The Archive
                </div>
            </div>

            {/* Masonry Archive Grid */}
            <section className="masonry-grid">
                {archivePosts.map((post) => (
                    <article key={post.id} className="masonry-item group cursor-pointer bg-white p-6 rounded-3xl border border-[#E0E0E0] hover:border-primary transition-colors duration-300">
                        <Link to={`/post/${post.id}`}>
                            <div className={`w-full ${post.aspectRatio} overflow-hidden rounded-full mb-6`}>
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale-img" />
                            </div>
                            <div className="flex flex-col gap-3 px-2">
                                <p className="text-[#8C8C8C] text-[13px] font-medium tracking-[0.1em] uppercase">
                                    {post.date} · {post.topic}
                                </p>
                                <h3 className="text-3xl font-normal leading-[1.2] text-[#0A0A0A] title-hover-italic font-display">
                                    {post.title}
                                </h3>
                                <p className="text-[#8C8C8C] text-base leading-relaxed mt-2 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    </article>
                ))}
            </section>

            {/* Load More Emulator */}
            <div className="mt-24 flex justify-center">
                <button className="w-16 h-16 rounded-full border border-[#E0E0E0] flex items-center justify-center text-[#0A0A0A] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group">
                    <span className="material-symbols-outlined text-2xl group-hover:animate-bounce">arrow_downward</span>
                </button>
            </div>
        </main>
    )
}

export default HomeArchive
