import React, { useState, useEffect } from 'react'
import Layout from './components/Layout'
import TheFeed from './components/TheFeed'
import TheVoid from './components/TheVoid'
import TheArchives from './components/TheArchives'
import TheTether from './components/TheTether'
import TheHierarchy from './components/TheHierarchy'
import TheArchiveGrid from './components/TheArchiveGrid'
import TheStratification from './components/TheStratification'
import TheDossier from './components/TheDossier'
import TheNexus from './components/TheNexus'
import TheNexusMobile from './components/TheNexusMobile'
import TheSignal from './components/TheSignal'
import TheSplash from './components/TheSplash'
import { useMobile } from './hooks/useMobile'
import { supabase } from './lib/supabase'

function App() {
  const isMobile = useMobile()
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('nexus')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [allEntries, setAllEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSignalOpen, setIsSignalOpen] = useState(false)
  const [systemSettings, setSystemSettings] = useState({
    typeface: 'serif', // 'serif' or 'mono'
    baseSize: 18,      // 14 to 32
    immersionMode: true
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAllEntries(data || []);
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])

  if (showSplash) {
    return <TheSplash onEnter={() => setShowSplash(false)} />
  }

  // Map Supabase entries to app format
  const feedItems = allEntries.map(item => ({
    id: item.id,
    title: item.title,
    source: item.category?.toUpperCase() || "SYSTEM",
    clarity: "100%",
    date: new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.'),
    readTime: "12",
    author: item.author || "Unknown",
    content: item.content_text || (typeof item.content === 'string' ? item.content : item.content?.content) || "",
    category: item.category,
    tags: item.tags || [],
    audioUrl: item.audio_url,
    images: item.images || []
  }))

  const archiveItems = feedItems.map(item => ({ ...item, isRead: false }));

  const handleArticleClick = (article) => {
    if (article.id && typeof article.id === 'string' && isNaN(parseInt(article.id))) {
      // This is a tab switch request (e.g., 'archives', 'transmit')
      setActiveTab(article.id)
    } else {
      setSelectedArticle(article)
      setActiveTab('reader')
    }
    setIsSignalOpen(false)
  }

  const handleBackToFeed = () => {
    setSelectedArticle(null)
    setActiveTab('feed')
  }

  const updateSystemSettings = (newSettings) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      settings={systemSettings}
      onSignalOpen={() => setIsSignalOpen(true)}
    >
      {/* THE SIGNAL OVERLAY – derived from the_signal template */}
      {isSignalOpen && (
        <TheSignal onClose={() => setIsSignalOpen(false)} onSelection={handleArticleClick} />
      )}

      {/* THE NEXUS – the_airlock_2 / the_airlock_7 template */}
      {activeTab === 'nexus' && (
        isMobile ? <TheNexusMobile onItemClick={handleArticleClick} /> : <TheNexus onSignalClick={handleArticleClick} />
      )}

      {/* THE FEED – the_airlock_3 / the_airlock_15 template */}
      {activeTab === 'feed' && (
        <TheFeed items={feedItems} onItemClick={handleArticleClick} />
      )}

      {/* THE VOID – the_vrinda template (reader) */}
      {activeTab === 'reader' && (
        <TheVoid
          title={selectedArticle?.title || "Transmission Unknown"}
          author={selectedArticle?.author || "Link Restricted"}
          readTime={selectedArticle?.readTime || "0"}
          date={selectedArticle?.date || "00.00.00"}
          content={selectedArticle?.content}
          onBack={handleBackToFeed}
          settings={systemSettings}
          audioUrl={selectedArticle?.audioUrl}
          images={selectedArticle?.images || []}
          tags={selectedArticle?.tags || []}
        />
      )}

      {/* THE ARCHIVES */}
      {activeTab === 'archives' && (
        <TheArchives items={archiveItems} onItemClick={handleArticleClick} />
      )}

      {/* THE TETHER (settings) */}
      {activeTab === 'settings' && (
        <TheTether settings={systemSettings} onUpdateSettings={updateSystemSettings} />
      )}

      {/* THE HIERARCHY – airlock_16 / airlock_10 */}
      {activeTab === 'hierarchy' && (
        <TheHierarchy />
      )}

      {/* THE ARCHIVE GRID */}
      {activeTab === 'grid' && (
        <TheArchiveGrid />
      )}

      {/* THE STRATIFICATION – airlock_5 / airlock_14 */}
      {activeTab === 'stratification' && (
        <TheStratification />
      )}

      {/* THE DOSSIER */}
      {activeTab === 'profile' && (
        <TheDossier />
      )}
    </Layout>
  )
}

export default App
