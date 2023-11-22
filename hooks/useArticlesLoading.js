import { useState, useEffect } from 'react';

const LIMIT = 10;

const useArticlesLoading = (items, loadAsync) => {
    const [isLoading, setIsLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [values, setValues] = useState([]);

    useEffect(() => {
        getItems();
    },[]);  

    useEffect(() => {
        setArticles(values?.slice(0, LIMIT) ?? []);
        setIsLoading(false);
    }, [values]);

    const getItems = async () => {
        if(loadAsync) {
            const _items = await loadAsync();
            setValues(_items);
        } else {
            setValues(items);
        }
    }

    onEndReached = () => {
        setArticles(prev => [...prev, ...values.slice(prev.length, prev.length + LIMIT)]);
    }

    return { isLoading, articles, onEndReached };
}

export default useArticlesLoading;