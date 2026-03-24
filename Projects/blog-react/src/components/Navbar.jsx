import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ onSearchOpen }) => (
    <div className="relative flex h-auto w-full flex-col bg-transparent group/design-root overflow-x-hidden" style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
            <div className="px-6 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
                    <header className="flex items-center justify-between whitespace-nowrap h-[80px]">
                        <Link to="/" className="flex items-center gap-4 text-[#0A0A0A]">
                            <div className="size-6 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <h2 className="text-[#0A0A0A] text-2xl font-bold leading-tight tracking-[-0.015em] hover:text-primary transition-colors cursor-pointer">Vrindopnishad</h2>
                        </Link>
                        <div className="flex flex-1 justify-end gap-8">
                            <div className="flex items-center gap-9">
                                <button onClick={onSearchOpen} className="text-[#0A0A0A] text-sm font-medium tracking-[0.1em] uppercase hover:text-primary transition-colors group flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">search</span>
                                    [Seek]
                                </button>
                                <Link to="/topics" className="text-[#0A0A0A] text-sm font-medium tracking-[0.1em] uppercase hover:text-primary transition-colors group flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">menu</span>
                                    [Topics]
                                </Link>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </div>
);

export default Navbar
