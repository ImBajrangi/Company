import React, { useState } from 'react'
import Layout from './components/Layout'
import TheFeed from './components/TheFeed'
import TheVoid from './components/TheVoid'
import TheArchives from './components/TheArchives'
import TheTether from './components/TheTether'
import TheHierarchy from './components/TheHierarchy'
import TheArchiveGrid from './components/TheArchiveGrid'
import TheStratification from './components/TheStratification'
import TheDossier from './components/TheDossier'

function App() {
  const [activeTab, setActiveTab] = useState('feed')
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Mock data – will be replaced by real data from useData hook
  const feedItems = [
    { id: 1, title: "The Cold Architecture of Deep Space", source: "0x4F.2", clarity: "98.4%", date: "24.08.23", readTime: "12", author: "J. Doe", content: null },
    { id: 2, title: "Minimalist Interfaces as a Shield Against Entropy", source: "0xA1.9", clarity: "72.1%", date: "20.08.23", readTime: "8", author: "N. Void" },
    { id: 3, title: "Post-Digital Reading Habits", source: "0xBC.4", clarity: "100%", date: "15.08.23", readTime: "15", author: "K. Stillness" },
    { id: 4, title: "Void Brutalism: A Manifesto", source: "0x00.0", clarity: "85.9%", date: "12.08.23", readTime: "6", author: "V. Null" },
    { id: 5, title: "Encrypted Memories and the Permanent Web", source: "0xFE.1", clarity: "94.2%", date: "08.08.23", readTime: "22", author: "S. Archive" },
  ]

  const archiveItems = [
    { title: "The Rot of the Internet", date: "24.10.2023", readTime: "12", isRead: false },
    { title: "Silence as a Service", date: "22.10.2023", readTime: "08", isRead: false },
    { title: "Digital Minimalism Guide", date: "20.10.2023", readTime: "15", isRead: false },
    { title: "Architectural Brutalism", date: "18.10.2023", readTime: "05", isRead: false },
    { title: "The Philosophy of Void", date: "16.10.2023", readTime: "22", isRead: false },
    { title: "Cognitive Load in UI", date: "12.10.2023", readTime: "", isRead: true },
  ]

  const handleArticleClick = (article) => {
    setSelectedArticle(article)
    setActiveTab('reader')
  }

  const handleBackToFeed = () => {
    setSelectedArticle(null)
    setActiveTab('feed')
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* THE FEED – the_airlock_3 template */}
      {activeTab === 'feed' && (
        <TheFeed items={feedItems} onItemClick={handleArticleClick} />
      )}

      {/* THE VOID – the_void template (reader) */}
      {activeTab === 'reader' && (
        <TheVoid
          title={selectedArticle?.title || "The Architecture of Silence"}
          author={selectedArticle?.author || "J. Doe"}
          readTime={selectedArticle?.readTime || "12"}
          date={selectedArticle?.date || "24.10.2023"}
          content={selectedArticle?.content}
          onBack={handleBackToFeed}
        />
      )}

      {/* THE ARCHIVES – the_archives template */}
      {activeTab === 'archives' && (
        <TheArchives items={archiveItems} onItemClick={handleArticleClick} />
      )}

      {/* THE TETHER – the_tether template (settings) */}
      {activeTab === 'settings' && (
        <TheTether />
      )}

      {/* THE HIERARCHY – the_airlock_1 template (leaderboard) */}
      {activeTab === 'hierarchy' && (
        <TheHierarchy />
      )}

      {/* THE ARCHIVE GRID – the_airlock_4 template (image gallery) */}
      {activeTab === 'grid' && (
        <TheArchiveGrid />
      )}

      {/* THE STRATIFICATION – the_airlock_5 template (rankings) */}
      {activeTab === 'stratification' && (
        <TheStratification />
      )}

      {/* THE DOSSIER – the_airlock_6 template (profile) */}
      {activeTab === 'profile' && (
        <TheDossier />
      )}
    </Layout>
  )
}

export default App
