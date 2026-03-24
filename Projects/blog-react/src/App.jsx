import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomeArchive from './pages/HomeArchive'
import ReadingRoom from './pages/ReadingRoom'
import TopicSanctum from './pages/TopicSanctum'

import SearchOverlay from './components/SearchOverlay'

const Navbar = ({ onSearchOpen }) => (
    <header className="flex items-center justify-between whitespace-nowrap h-[100px] px-6 md:px-12 lg:px-24 bg-transparent border-b border-black/5">
        <Link to="/" className="flex items-center gap-4 text-[#0A0A0A] hover:text-[#1717cf] transition-all">
            <div className="size-6 text-[#1717cf]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">Vrindopnishad</h2>
        </Link>
        <div className="flex items-center gap-12 font-medium text-sm tracking-[0.1em] uppercase">
            <Link to="/" className="hover:text-[#1717cf] transition-all">[Archive]</Link>
            <Link to="/topics/Meditation" className="hover:text-[#1717cf] transition-all">[Topics]</Link>
            <button onClick={onSearchOpen} className="hover:text-[#1717cf] transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">search</span> [Seek]
            </button>
        </div>
    </header>
);

function App() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
          <Routes>
            <Route path="/" element={<HomeArchive />} />
            <Route path="/post/:slug" element={<ReadingRoom />} />
            <Route path="/topics/:category" element={<TopicSanctum />} />
            <Route path="/topics" element={<TopicSanctum />} />
          </Routes>
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          <footer className="py-24 border-t border-black/5 text-center text-[#8C8C8C] text-sm uppercase tracking-[0.1em]">
            &copy; 2026 Vrindopnishad — The Silence of Wisdom
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
