import { useState, useEffect } from 'react';
import { blogPosts } from '../data/wisdom-data';

export const useWisdom = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPosts(blogPosts);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const getPostById = (id) => posts.find(p => p.id === id);
    const getPostsByTopic = (topic) => posts.filter(p => p.topic === topic);

    return { posts, loading, getPostById, getPostsByTopic };
};
