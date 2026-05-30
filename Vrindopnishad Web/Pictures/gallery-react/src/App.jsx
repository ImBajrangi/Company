import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CollectionRow from './components/CollectionRow';
import PopupModal from './components/PopupModal';
import SearchOverlay from './components/SearchOverlay';
import Footer from './components/Footer';
import CollectionDetails from './components/CollectionDetails';
import CustomCursor from './components/CustomCursor';
import CookieConsent from './components/CookieConsent';
import { gsap } from 'gsap';
import { NotificationProvider } from './context/NotificationContext';
import { fetchSacredCollections, fetchSacredConfig } from './lib/databaseBridge';
import './index.css';
import './styles/premium-sync.css';
import './styles/ecommerce.css';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { updateSEO } from './lib/seoHelper';

function App() {
  const [collectionsData, setCollectionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myList, setMyList] = useState(() => {
    return JSON.parse(localStorage.getItem('myCollectionList') || '[]');
  });
  const [searchActive, setSearchActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentView, setCurrentView] = useState('gallery'); // 'gallery' or 'details'
  const [detailsData, setDetailsData] = useState(null);
  const [siteConfig, setSiteConfig] = useState({
    siteName: "Chitra Vrinda",
    tagline: "Divine art that inspires",
    description: "A carefully curated collection of spiritual photography and sacred artworks from Vrindavan."
  });
  const [heroSection, setHeroSection] = useState(null);
  
  // Local storage cached shopping cart state
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('divine-cart') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync cart to local storage cache
  useEffect(() => {
    localStorage.setItem('divine-cart', JSON.stringify(cart));
  }, [cart]);

  // Dynamic SEO structured schema injection on view changes
  useEffect(() => {
    if (currentView === 'gallery') {
      updateSEO('gallery', collectionsData);
    } else if (currentView === 'details' && detailsData) {
      updateSEO('details', detailsData);
    }
  }, [currentView, detailsData, collectionsData]);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.id === item.id && i.mediaType === item.mediaType && i.size === item.size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { ...item, cartId: `${item.id}-${item.mediaType}-${item.size}` }];
    });
  };

  const handleUpdateQty = (cartId, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: qty } : item));
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    fetchCollections();

    // Disable right-click for image protection like vanilla version
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.collection-item') || e.target.closest('.main-image-container')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const fixPath = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Handle paths starting with .. by prepending production domain
    if (path.startsWith('..')) {
      return `https://vrindopnishad.in/Vrindopnishad%20Web/${path.replace(/^\.\.\//, '').replace(/^\.\.\//, '')}`;
    }
    return path.replace(/^\/Vrindopnishad Web\//, '/');
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      
      // Fetch Config and Hero
      const config = await fetchSacredConfig();
      if (config) {
        setSiteConfig(config.siteConfig);
        setHeroSection(config.heroSection);
      }

      // Fetch Sacred Collections via Bridge (Priority: Firebase -> JSON -> Supabase)
      const data = await fetchSacredCollections();

      if (data) {
        // Data is already structured by the bridge or comes from the JSON tree
        const structuredData = {};
        
        // Handle both object-based (JSON) and flat-array data
        Object.entries(data).forEach(([key, section]) => {
          if (section && section.items) {
            structuredData[key] = {
              ...section,
              items: section.items.map(item => ({
                ...item,
                image: fixPath(item.image),
                images: Array.isArray(item.images) ? item.images.map(img => fixPath(img)) : []
              }))
            };
          }
        });

        setCollectionsData(structuredData);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMyList = (item) => {
    const newList = [...myList];
    const index = newList.findIndex(i => i.id === item.id);
    if (index === -1) {
      newList.push(item);
    } else {
      newList.splice(index, 1);
    }
    setMyList(newList);
    localStorage.setItem('myCollectionList', JSON.stringify(newList));
  };

  const handleViewDetails = (item) => {
    setDetailsData(item);
    setCurrentView('details');
    setSelectedItem(null);
    window.scrollTo(0, 0);
  };

  const handleGoBack = () => {
    setCurrentView('gallery');
    setDetailsData(null);
    window.scrollTo(0, 0);
  };

  return (
    <NotificationProvider>
      <div className="app-container">
        <CustomCursor />
        <CookieConsent />
        <Navbar
          onSearchClick={() => setSearchActive(true)}
          myListCount={myList.length}
          siteConfig={siteConfig}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
        />

        <SearchOverlay
          active={searchActive}
          onClose={() => setSearchActive(false)}
          collectionsData={collectionsData}
          onItemClick={(item) => {
            setSelectedItem(item);
            setSearchActive(false);
          }}
        />

        {currentView === 'gallery' ? (
          <main className="main-content">
            <Hero heroSection={heroSection} siteConfig={siteConfig} />

            {myList.length > 0 && (
              <CollectionRow
                title="My List"
                items={myList}
                onItemClick={setSelectedItem}
                isMyList={true}
              />
            )}

            {Object.entries(collectionsData).map(([key, section]) => (
              section.items.length > 0 && (
                <CollectionRow
                  key={key}
                  title={section.title}
                  items={section.items}
                  onItemClick={setSelectedItem}
                />
              )
            ))}

            {loading && <div className="loading-state">Loading divine collections...</div>}
            {error && <div className="error-state">Error: {error}</div>}
          </main>
        ) : (
          <CollectionDetails
            data={detailsData}
            onBack={handleGoBack}
            onToggleMyList={toggleMyList}
            isInList={detailsData ? myList.some(i => i.id === detailsData.id) : false}
            onAddToCart={handleAddToCart}
          />
        )}

        <PopupModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onToggleMyList={toggleMyList}
          isInList={selectedItem ? myList.some(i => i.id === selectedItem.id) : false}
          onViewDetails={handleViewDetails}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cart}
          onClearCart={handleClearCart}
        />

        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default App;
