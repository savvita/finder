import AsyncStorage from '@react-native-async-storage/async-storage';

const CITY_KEY = 'city';
const SHOP_KEY = 'shop';

const setCity = (value) => {
    if(value) {
        storeData(CITY_KEY, value);
    }
}

const getCity = async () => {
    return await getData(CITY_KEY);
}

const setShops = async (values) => {
    if(values) {
        await storeData(SHOP_KEY, JSON.stringify(values));
    }
}

const getShops = async () => {
    const values = await getData(SHOP_KEY);
    if(values) {
        return JSON.parse(values);
    }

    return [];
}


const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.log(e)
    }
};

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
    }
};

export default {
    setCity: setCity,
    getCity: getCity,
    setShops: setShops,
    getShops: getShops
}