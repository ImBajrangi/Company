import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Images, Star, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CollectionRow = ({ title, items, onItemClick, isMyList = false }) => {
    const sliderRef = useRef(null);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);

    const updateButtonStates = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowLeftBtn(scrollLeft > 0);
            setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        updateButtonStates();
        window.addEventListener('resize', updateButtonStates);
        
        // GSAP Entrance Animation - "Premium Reveal"
        if (sliderRef.current) {
            const items = sliderRef.current.querySelectorAll('.collection-item');
            gsap.fromTo(items, 
                { 
                    opacity: 0, 
                    scale: 0.95,
                    y: 20 
                },
                { 
                    opacity: 1, 
                    scale: 1,
                    y: 0, 
                    duration: 0.6, 
                    stagger: 0.05, 
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sliderRef.current,
                        start: "top 90%",
                        once: true
                    }
                }
            );
        }

        return () => window.removeEventListener('resize', updateButtonStates);
    }, [items]);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.offsetWidth * 0.8;
            sliderRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={`content-row ${isMyList ? 'my-list-row active' : ''}`}>
            <div className="row-header">
                <h2 className="row-title">{title}</h2>
            </div>
            <div className="slider-container">
                <div
                    className="items-slider"
                    ref={sliderRef}
                    onScroll={updateButtonStates}
                >
                    {items.map((item, index) => (
                        <div
                            key={`${item.id || 'item'}-${index}`}
                            className="collection-item"
                            onClick={() => onItemClick(item)}
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <div className="price-tag">₹{item.price || 501}</div>
                            
                            <div className="item-content">
                                <h3 className="item-title">{item.title}</h3>
                                <p className="item-description">{item.description}</p>
                                
                                <div className="item-stats">
                                    <span className="item-count">
                                        <Images size={14} style={{ marginRight: '4px' }} />
                                        {item.count || item.itemCount || 0} images
                                    </span>
                                    {item.rating && (
                                        <span className="item-rating">
                                            <Star size={14} style={{ marginRight: '4px' }} />
                                            {item.rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                <button 
                                    className="quick-add-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Trigger bag notification/logic if needed
                                    }}
                                >
                                    <span className="btn-text">COLLECT DIVINE</span>
                                    <ShoppingBag size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showLeftBtn && (
                    <button className="scroll-btn left" onClick={() => scroll(-1)}>
                        <ChevronLeft size={24} />
                    </button>
                )}

                {showRightBtn && (
                    <button className="scroll-btn right" onClick={() => scroll(1)}>
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CollectionRow;
