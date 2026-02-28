import { useState, useEffect } from 'react';

/**
 * useData Hook
 * Consolidates the logic from the previous UnifiedDataManager into a React-friendly hook.
 * Handles fetching spiritual texts, gallery items, and collection metadata.
 */
export const useData = () => {
    const [data, setData] = useState({
        books: [],
        entries: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // In a real migration, we'd fetch from the local /public/data or a remote API
                // For now, we'll use the structured mock data pattern to ensure UI stability
                const mockBooks = [
                    {
                        id: 1,
                        title: "The Essence of Bhakti",
                        author: "Vedic Manuscript",
                        description: "A journey into the heart of devotion.",
                        image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1000",
                        category: "Devotional"
                    },
                    {
                        id: 2,
                        title: "Divine Silence",
                        author: "Sage Wisdom",
                        description: "Exploring the depth of inner peace.",
                        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000",
                        category: "Spiritual"
                    }
                ];

                setData({
                    books: mockBooks,
                    entries: [], // To be populated with poems/texts
                    loading: false,
                    error: null
                });
            } catch (err) {
                setData(prev => ({ ...prev, loading: false, error: err.message }));
            }
        };

        fetchAllData();
    }, []);

    return data;
};

export default useData;
