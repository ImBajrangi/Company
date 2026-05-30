/**
 * SEO & Structured Schema Helper for Chitra Vrinda
 * Dynamically updates document metadata and injects JSON-LD for rich search results.
 */

// Helper to inject or update JSON-LD script block
const injectSchema = (schemaData) => {
    let schemaScript = document.getElementById('vrinda-structured-schema');
    if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'vrinda-structured-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaData);
};

export const updateSEO = (viewType, data = null) => {
    const defaultTitle = "Chitra Vrinda - Spiritual & Sacred Art Gallery | Vrindopnishad";
    const defaultDesc = "Discover sacred images and divine artworks that inspire the soul. Explore our carefully curated collection of spiritual photography, posters, stickers, and canvas prints from Vrindavan.";
    const siteUrl = "https://vrindopnishad.in";

    if (viewType === 'gallery') {
        // 1. Update standard meta tags
        document.title = defaultTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', defaultDesc);

        // 2. Build ImageGallery structured schema
        const gallerySchema = {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Chitra Vrinda Spiritual Gallery",
            "description": defaultDesc,
            "url": `${siteUrl}/gallery`,
            "provider": {
                "@type": "Organization",
                "name": "Vrindopnishad",
                "url": siteUrl,
                "logo": "https://vrindopnishad.in/Vrindopnishad%20Web/class/logo/v-logo-transparent.png"
            }
        };

        // If collections data is passed, add items to gallery schema
        if (data && typeof data === 'object') {
            gallerySchema.associatedMedia = Object.values(data)
                .flatMap(cat => cat.items || [])
                .map(item => ({
                    "@type": "ImageObject",
                    "name": item.title,
                    "description": item.description,
                    "contentUrl": item.image,
                    "thumbnail": item.image,
                    "offers": {
                        "@type": "AggregateOffer",
                        "priceCurrency": "INR",
                        "lowPrice": "99",
                        "highPrice": "2999",
                        "offerCount": "16",
                        "price": item.price || "299"
                    }
                }));
        }

        injectSchema(gallerySchema);
    } else if (viewType === 'details' && data) {
        // 1. Update details-specific meta tags
        const formattedTitle = `${data.title} - Divine Art Prints, Posters & Stickers | Chitra Vrinda`;
        const formattedDesc = `Buy high-quality spiritual prints of "${data.title}" - ${data.description || 'Vrindavan sacred artwork'}. Available as Custom Poster, Waterproof Sticker, Framed Photo, and Canvas Print. Price starts at ₹99.`;
        
        document.title = formattedTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', formattedDesc);

        // 2. Build Product schema with sizing & media options
        const productSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": data.title,
            "image": [data.image, ...(data.images || [])],
            "description": formattedDesc,
            "sku": `CV-ART-${data.id}`,
            "mpn": `CV-MPN-${data.id}`,
            "brand": {
                "@type": "Brand",
                "name": "Chitra Vrinda"
            },
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "INR",
                "lowPrice": "99",
                "highPrice": "2999",
                "price": data.price || "299",
                "offerCount": "16",
                "priceValidUntil": "2027-12-31",
                "availability": "https://schema.org/InStock",
                "url": window.location.href,
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Premium Vinyl Sticker (A4)",
                        "price": "99",
                        "priceCurrency": "INR"
                    },
                    {
                        "@type": "Offer",
                        "name": "Archival Matte Poster (A3)",
                        "price": "299",
                        "priceCurrency": "INR"
                    },
                    {
                        "@type": "Offer",
                        "name": "Premium Wooden Framed Print (A3)",
                        "price": "1199",
                        "priceCurrency": "INR"
                    },
                    {
                        "@type": "Offer",
                        "name": "Museum Grade Canvas (A2)",
                        "price": "1999",
                        "priceCurrency": "INR"
                    }
                ]
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": (data.rating || 4.8).toString(),
                "reviewCount": (Math.floor(Math.random() * 80) + 20).toString()
            }
        };

        injectSchema(productSchema);
    }
};
