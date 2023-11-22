import AsyncStorage from '@react-native-async-storage/async-storage';

const CITY_KEY = 'city';
const SHOP_KEY = 'shop';
const THEME_KEY = 'light_theme';
const FAVOURITE_KEY = 'favourite';
const RADIOMAG_PAGE_KEY = 'radiomag_page';
const MICROTEH_PAGE_KEY = 'microteh_page';

const removeCity = async () => {
     await removeItem(MICROTEH_PAGE_KEY);
}

const removeItem = async (key) => {
    await AsyncStorage.removeItem(key);
}

const setCity = (value) => {
    if(value) {
        storeData(CITY_KEY, value);
    }
}

const getCity = async () => {
    return await getData(CITY_KEY);
}

const setRadiomagPage = (value) => {
    if(value) {
        storeData(RADIOMAG_PAGE_KEY, value);
    }
}

const getRadiomagPage = async () => {
    return await getData(RADIOMAG_PAGE_KEY);
}

const setMicrotehPage = (value) => {
    if(value) {
        storeData(MICROTEH_PAGE_KEY, value);
    }
}

const getMicrotehPage = async () => {
    return await getData(MICROTEH_PAGE_KEY);
}

const setTheme = (value) => {
    if(value) {
        storeData(THEME_KEY, value);
    }
}

const getTheme = async () => {
    return await getData(THEME_KEY);
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

const setFavourites = async (values) => {
    if(values) {
        await storeData(FAVOURITE_KEY, JSON.stringify(values));
    }
}

const getFavourites = async () => {
    const values = await getData(FAVOURITE_KEY);
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
    removeCity: removeCity,
    setShops: setShops,
    getShops: getShops,
    setTheme: setTheme,
    getTheme: getTheme,
    setFavourites: setFavourites,
    getFavourites: getFavourites,
    setRadiomagPage: setRadiomagPage,
    getRadiomagPage: getRadiomagPage,
    setMicrotehPage: setMicrotehPage,
    getMicrotehPage: getMicrotehPage
}