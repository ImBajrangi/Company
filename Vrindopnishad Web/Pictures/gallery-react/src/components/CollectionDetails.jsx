import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Share2, ShoppingCart, Heart, Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const CollectionDetails = ({ data, onBack, onToggleMyList, isInList, onAddToCart }) => {
    const { showNotification } = useNotifications();
    const [mainImage, setMainImage] = useState(data?.image);
    const [activeIndex, setActiveIndex] = useState(0);

    // E-Commerce Product Options state
    const [mediaType, setMediaType] = useState('poster'); // 'sticker', 'poster', 'frame', 'canvas'
    const [size, setSize] = useState('medium'); // 'small', 'medium', 'large', 'collector'

    useEffect(() => {
        if (data) {
            setMainImage(data.image);
            setActiveIndex(0);
        }
    }, [data]);

    if (!data) return null;

    const mediaOptions = [
        { id: 'sticker', name: 'Vinyl Sticker', desc: 'Waterproof matte vinyl, great for laptops/gadgets', base: 99, rate: 0.33 },
        { id: 'poster', name: 'Archival Poster', desc: 'Premium 220 GSM matte art paper', base: 299, rate: 1.0 },
        { id: 'frame', name: 'Framed Picture', desc: 'Sleek black wooden frame with acrylic glass', base: 899, rate: 3.0 },
        { id: 'canvas', name: 'Premium Canvas', desc: 'Textured canvas hand-stretched on wood frame', base: 1499, rate: 5.0 }
    ];

    const sizeOptions = [
        { id: 'small', name: 'Small (A4)', dimens: '8" x 12"', scale: 0.75 },
        { id: 'medium', name: 'Medium (A3)', dimens: '12" x 18"', scale: 1.0 },
        { id: 'large', name: 'Large (A2)', dimens: '16" x 24"', scale: 1.5 },
        { id: 'collector', name: 'Collector (A1)', dimens: '24" x 36"', scale: 2.2 }
    ];

    // Compute dynamic price based on option selections
    const calculatePrice = () => {
        const selectedMedia = mediaOptions.find(m => m.id === mediaType);
        const selectedSize = sizeOptions.find(s => s.id === size);
        
        if (mediaType === 'sticker') {
            // Stickers are cheaper
            if (size === 'small') return 99;
            if (size === 'medium') return 149;
            if (size === 'large') return 229;
            return 349;
        }
        if (mediaType === 'poster') {
            if (size === 'small') return 249;
            if (size === 'medium') return 399;
            if (size === 'large') return 699;
            return 999;
        }
        if (mediaType === 'frame') {
            if (size === 'small') return 799;
            if (size === 'medium') return 1199;
            if (size === 'large') return 1899;
            return 2899;
        }
        if (mediaType === 'canvas') {
            if (size === 'small') return 1299;
            if (size === 'medium') return 1899;
            if (size === 'large') return 2799;
            return 3999;
        }
        return 399;
    };

    const currentPrice = calculatePrice();
    const images = Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image];

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: data.title,
                text: data.description,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            showNotification('Product link copied!', 'success');
        }
    };

    const handleAddToCart = () => {
        const itemConfig = {
            id: data.id,
            title: data.title,
            image: mainImage,
            mediaType: mediaOptions.find(m => m.id === mediaType).name,
            size: sizeOptions.find(s => s.id === size).name + ` (${sizeOptions.find(s => s.id === size).dimens})`,
            price: currentPrice,
            quantity: 1
        };
        onAddToCart(itemConfig);
        showNotification(`Added ${data.title} (${itemConfig.mediaType}) to cart!`, 'success');
    };

    return (
        <div className="collection-details-view">
            <div className="product-container">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={20} /> Back to Gallery
                </button>

                <div className="product-grid" style={{ marginTop: '20px' }}>
                    
                    {/* Left: Gallery and Live Mockup */}
                    <div className="gallery-section">
                        {/* Live Room / Mockup Visualizer */}
                        <div className="mockup-visualizer">
                            {/* Mock room backdrop */}
                            <div 
                                className="mockup-room-bg" 
                                style={{ backgroundImage: 'url(https://i.postimg.cc/nzYrqZTT/tempImagepeTFpY.avif)' }}
                            ></div>
                            
                            {/* Renders frame, canvas or sticker style mock based on state */}
                            <div className={`mockup-art-container ${mediaType === 'frame' ? 'frame-premium' : mediaType === 'canvas' ? 'canvas' : mediaType === 'sticker' ? 'sticker' : ''}`}>
                                <img src={mainImage} alt={data.title} className="mockup-art-img" />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="thumbnail-grid">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumbnail ${activeIndex === idx ? 'active' : ''}`}
                                    onClick={() => {
                                        setMainImage(img);
                                        setActiveIndex(idx);
                                    }}
                                >
                                    <img src={img} alt={`${data.title} preview ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details & Configurator */}
                    <div className="product-info">
                        <span className="product-new">PREMIUM SACRED PRINT</span>
                        <h1 className="product-title">{data.title}</h1>
                        <h2 className="product-subtitle">Chitra Vrinda Fine Art Series</h2>

                        {/* Ratings */}
                        <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="stars" style={{ display: 'flex', color: 'var(--primary-gold)' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < 5 ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="rating-text">5.0 (48 reviews) • High Resolution</span>
                        </div>

                        {/* Dynamic Price */}
                        <div className="price-section" style={{ margin: '20px 0', borderBottom: '1px solid var(--dark-border)', paddingBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                <span className="price" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary-gold)' }}>₹{currentPrice}</span>
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '15px' }}>₹{Math.floor(currentPrice * 1.5)}</span>
                                <span style={{ color: '#3ec74f', fontSize: '13px', fontWeight: 'bold' }}>33% OFF</span>
                            </div>
                            <p className="price-note" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Inclusive of all GST. Free shipping above ₹1000.
                            </p>
                        </div>

                        {/* Config 1: Media Format Selection */}
                        <div>
                            <h3 className="options-heading">1. Choose Format</h3>
                            <div className="options-grid">
                                {mediaOptions.map((media) => (
                                    <div 
                                        key={media.id} 
                                        className={`option-card ${mediaType === media.id ? 'active' : ''}`}
                                        onClick={() => setMediaType(media.id)}
                                    >
                                        <span className="option-name">{media.name}</span>
                                        <span className="option-desc">{media.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Config 2: Dimension Selection */}
                        <div>
                            <h3 className="options-heading">2. Choose Size</h3>
                            <div className="size-grid">
                                {sizeOptions.map((opt) => (
                                    <div
                                        key={opt.id}
                                        className={`size-card ${size === opt.id ? 'active' : ''}`}
                                        onClick={() => setSize(opt.id)}
                                    >
                                        <span className="size-name">{opt.name}</span>
                                        <span className="size-dimens">{opt.dimens}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buy Actions */}
                        <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '30px 0 20px 0' }}>
                            <button className="btn btn-primary" onClick={handleAddToCart}>
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button
                                className={`btn ${isInList ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => onToggleMyList(data)}
                            >
                                {isInList ? <><Check size={20} /> Saved in List</> : <><Heart size={20} /> Add to Wishlist</>}
                            </button>
                        </div>

                        <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleShare}>
                            <Share2 size={18} style={{ marginRight: '8px' }} /> Share with Devotees & Friends
                        </button>

                        {/* Quality Assurances */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--dark-border)', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <ShieldCheck size={20} style={{ color: '#3ec74f' }} />
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Archival Inks</strong>
                                    Fades-resistant for 100+ years
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                <ShieldCheck size={20} style={{ color: '#3ec74f' }} />
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Secure Delivery</strong>
                                    Sturdy tubes & double padding
                                </div>
                            </div>
                        </div>

                        {/* About/Details text */}
                        <div className="product-description" style={{ marginTop: '30px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>transcendental Description</h3>
                            <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                {data.description || 'Bring the holy, soothing atmosphere of Vrindavan into your home or office space. Printed on premium media materials under expert color matching to ensure that every divine details sparkles beautifully.'}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetails;
