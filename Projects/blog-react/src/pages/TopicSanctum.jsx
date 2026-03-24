import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWisdom } from '../hooks/useWisdom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const TopicSanctum = () => {
    const { category } = useParams();
    const { posts, categories, loading } = useWisdom();

    if (loading) return <div className="p-20 text-center font-display italic animate-pulse">Seeking topics in the silence...</div>;

    const topics = categories.length > 0 ? categories.map(c => c.name) : ["Meditation", "Non-Duality", "Dharma"];
    const currentTopic = category || (topics.length > 0 ? topics[0] : "Meditation");
    const filteredPosts = posts.filter(p => p.topic.toLowerCase() === currentTopic.toLowerCase());

    return (
        <div className="relative flex h-auto w-full flex-col bg-[#FAFAFA] group/design-root overflow-x-hidden font-display pt-10">
            <Helmet>
                <title>{currentTopic} — Topic Sanctum</title>
            </Helmet>
            
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
                        
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                            {/* Sticky Sidebar Navigation */}
                            <nav className="lg:w-[300px] shrink-0">
                                <div className="lg:sticky lg:top-12 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 lg:pb-0 border-b border-[#E0E0E0] lg:border-none">
                                    {topics.map((topic) => (
                                        <Link 
                                            key={topic}
                                            to={`/topics/${topic}`}
                                            className={`group flex items-center text-2xl whitespace-nowrap px-4 py-2 lg:p-0 rounded-full lg:rounded-none transition-all ${
                                                currentTopic.toLowerCase() === topic.toLowerCase() 
                                                ? "text-[#1A1A1A] font-bold bg-[#F0F0F0] lg:bg-transparent" 
                                                : "text-[#8C8C8C] hover:text-[#1A1A1A] bg-transparent"
                                            }`}
                                        >
                                            <span className={`hidden lg:inline mr-2 transition-transform transform ${
                                                currentTopic.toLowerCase() === topic.toLowerCase() 
                                                ? "text-primary translate-x-0" 
                                                : "text-transparent group-hover:text-[#E0E0E0] -translate-x-2 group-hover:translate-x-0"
                                            }`}>—</span>
                                            {topic}
                                        </Link>
                                    ))}
                                </div>
                            </nav>

                            {/* Results Column */}
                            <main className="flex-1 w-full max-w-[800px]">
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={currentTopic}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className="mb-16">
                                            <h1 className="text-5xl md:text-6xl lg:text-[64px] font-normal leading-tight tracking-[-0.02em] text-[#0A0A0A]">
                                                Teachings on <br className="hidden md:block"/>
                                                <span className="italic font-medium">{currentTopic}</span>
                                            </h1>
                                        </div>

                                        <div className="flex flex-col">
                                            {filteredPosts.map((post) => (
                                                <article key={post.id} className="group flex flex-col md:flex-row gap-8 items-center md:items-start w-full border-b border-[#E0E0E0] py-10 hover:bg-[#FFFFFF] transition-colors duration-300 px-4 md:-mx-4 md:px-4 rounded-xl cursor-pointer">
                                                    <Link to={`/post/${post.slug}`} className="flex flex-col md:flex-row gap-8 w-full">
                                                        <div className="shrink-0">
                                                            <div className="w-40 h-40 md:w-[200px] md:h-[200px] rounded-full overflow-hidden bg-[#E0E0E0] relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                                                <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col flex-1 justify-center md:pt-4 text-center md:text-left">
                                                            <div className="text-[13px] uppercase tracking-[2px] text-[#8C8C8C] font-sans font-medium mb-3">
                                                                {post.date} · 8 min read
                                                            </div>
                                                            <h3 className="text-3xl md:text-4xl text-[#0A0A0A] font-medium leading-tight mb-4 group-hover:text-primary transition-colors">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-lg text-[#1A1A1A] leading-[1.8] font-sans line-clamp-2">
                                                                {post.excerpt}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </article>
                                            ))}
                                            {filteredPosts.length === 0 && (
                                                <p className="py-20 text-center text-text-muted italic">The archives for {currentTopic} are yet to be transcribed.</p>
                                            )}
                                        </div>

                                        <div className="flex justify-center mt-20 mb-32">
                                            <div className="w-2 h-2 rounded-full bg-[#E0E0E0]"></div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopicSanctum
