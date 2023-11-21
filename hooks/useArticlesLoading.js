import { useState, useEffect } from 'react';

const LIMIT = 10;

const useArticlesLoading = (items) => {
    const [isLoading, setIsLoading] = useState(true);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        setArticles(items?.slice(0, LIMIT) ?? []);
        setIsLoading(false);
    },[]);  

    onEndReached = () => {
        setArticles(prev => [...prev, ...items.slice(prev.length, prev.length + LIMIT)]);
    }

    return { isLoading, articles, onEndReached };
}

export default useArticlesLoading;