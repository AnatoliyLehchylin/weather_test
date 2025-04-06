import { WeatherData } from '../../components/WeatherApp/WeatherApp';

const CACHE_KEY = 'weather_cache';

type WeatherCache = {
    [city: string]: {
        data: WeatherData;
        timestamp: number;
    };
};

export const getCachedWeather = (city: string): WeatherData | null => {
    const cache: WeatherCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');

    const cachedCity = cache[city];
    if (cachedCity && Date.now() - cachedCity.timestamp < 300000) {
        return cachedCity.data;
    }
    return null;
};

export const setCachedWeather = (city: string, data: WeatherData): void => {
    const cache: WeatherCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[city] = {
        data,
        timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};
