import { supabase } from '../lib/supabase';

/**
 * Data mapping helper to normalize Supabase 'content' records to Stitch component props
 */
const mapContentToPost = (item) => {
    // Attempt to extract the first image URL from the array
    const images = item.image_urls || [];
    const mainImage = images.length > 0 ? images[0] : '/assets/hero.png';
    
    const dateObj = new Date(item.created_at);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();

    return {
        id: item.id,
        title: item.title,
        slug: item.slug || item.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        date: formattedDate,
        topic: item.category || 'Meditation',
        excerpt: item.description || (item.english_translation ? item.english_translation.substring(0, 150) + '...' : 'Peace in the silence...'),
        author: item.author || 'Vrindopnishad',
        image: mainImage,
        featured: item.tags?.includes('featured') || false,
        aspectRatio: item.tags?.includes('portrait') ? 'aspect-[3/4]' : (item.tags?.includes('square') ? 'aspect-square' : 'aspect-[4/3]'),
        content: item.english_translation || item.hindi_text || '',
        hindi: item.hindi_text || '',
        english: item.english_translation || '',
        sanskrit: item.sanskrit_text || ''
    };
};

export const api = {
    async fetchPosts() {
        try {
            const { data, error } = await supabase
                .from('blogvrinda')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data.map(mapContentToPost);
        } catch (error) {
            console.error('Error fetching blogvrinda posts:', error);
            return [];
        }
    },

    async fetchCategories() {
        try {
            const { data, error } = await supabase
                .from('blogvrinda')
                .select('category')
                .not('category', 'is', null);

            if (error) throw error;
            
            const unique = [...new Set(data.map(i => i.category))];
            return unique.map(name => ({
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
};
