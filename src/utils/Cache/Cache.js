const CACHE_KEY = 'weather_cache';
export const getCachedWeather = (city) => {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cachedCity = cache[city];
    if (cachedCity && Date.now() - cachedCity.timestamp < 300000) {
        return cachedCity.data;
    }
    return null;
};
export const setCachedWeather = (city, data) => {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[city] = {
        data,
        timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};
