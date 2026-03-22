import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('divine-cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('divine-cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('divine-cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent active">
            <div className="cookie-content">
                <div className="cookie-icon">
                    <Cookie size={24} />
                </div>
                <div className="cookie-text">
                    <h3>Divine Cookie Policy</h3>
                    <p>We use divine cookies to enhance your spiritual browsing experience on Chitra Vrinda.</p>
                </div>
                <div className="cookie-actions">
                    <button className="cookie-btn accept" onClick={handleAccept}>Accept</button>
                    <button className="cookie-btn decline" onClick={handleDecline}>Decline</button>
                </div>
            </div>
            <button className="cookie-close" onClick={() => setIsVisible(false)}>
                <X size={14} />
            </button>
        </div>
    );
};

export default CookieConsent;
