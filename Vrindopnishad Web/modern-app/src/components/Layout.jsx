import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Radio, Database, Search, Settings, User, BarChart3, Grid3x3, Trophy } from 'lucide-react';

const Layout = ({
    children,
    activeTab = 'feed',
    setActiveTab = () => { },
    title = "The Feed - All Content | Deep Void",
    description = "A digital sanctuary for deep reading and archival silence.",
}) => {
    const navItems = [
        { id: 'feed', icon: <Database size={20} />, label: 'Feed' },
        { id: 'archives', icon: <Search size={20} />, label: 'Archives' },
        { id: 'grid', icon: <Grid3x3 size={20} />, label: 'Grid' },
        { id: 'hierarchy', icon: <BarChart3 size={20} />, label: 'Hierarchy' },
        { id: 'stratification', icon: <Trophy size={20} />, label: 'Rankings' },
        { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content="Vrindavan, Spirituality, Vedic Art, Paath, Divine Knowledge, Deep Reading" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Organization",
                                "@id": "https://vrindopnishad.in/#organization",
                                "name": "Vrindopnishad",
                                "url": "https://vrindopnishad.in/",
                                "description": description
                            },
                            {
                                "@type": "WebSite",
                                "@id": "https://vrindopnishad.in/#website",
                                "url": "https://vrindopnishad.in/",
                                "name": "VRINDOPNISHAD",
                                "publisher": { "@id": "https://vrindopnishad.in/#organization" }
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-display relative">
                {/* Sidebar Navigation */}
                <nav className="sidebar-nav">
                    <button
                        className="text-[#f04242]"
                        onClick={() => setActiveTab('feed')}
                    >
                        <Radio size={22} />
                    </button>
                    <div className="flex flex-col gap-4 mt-4">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`transition-colors p-1.5 ${activeTab === item.id ? 'text-[#E5E5E5]' : 'text-[#404040] hover:text-[#E5E5E5]'}`}
                                title={item.label}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                    {/* Profile at bottom */}
                    <div className="mt-auto">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`transition-colors p-1.5 ${activeTab === 'profile' ? 'text-[#E5E5E5]' : 'text-[#404040] hover:text-[#E5E5E5]'}`}
                            title="Profile"
                        >
                            <User size={20} />
                        </button>
                    </div>
                </nav>

                {/* Main Content Area – offset by sidebar width */}
                <main style={{ paddingLeft: '60px' }} className="min-h-screen">
                    {children}
                </main>

                {/* Noise Texture */}
                <div className="noise-overlay"></div>
            </div>
        </HelmetProvider>
    );
};

export default Layout;
