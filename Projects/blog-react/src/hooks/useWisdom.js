import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useWisdom = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWisdom = async () => {
            setLoading(true);
            const [postsData, catsData] = await Promise.all([
                api.fetchPosts(),
                api.fetchCategories()
            ]);
            setPosts(postsData);
            setCategories(catsData);
            setLoading(false);
        };
        loadWisdom();
    }, []);

    const getPostById = (id) => {
        return posts.find(post => post.id === id);
    };

    const getPostBySlug = (slug) => {
        return posts.find(post => post.slug === slug);
    };

    return {
        posts,
        categories,
        loading,
        getPostById,
        getPostBySlug
    };
};
