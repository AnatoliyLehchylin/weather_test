import { getCachedWeather, setCachedWeather } from './Cache';
describe('Cache', () => {
    const city = 'Kyiv';
    const mockWeatherData = {
        name: 'Kyiv',
        temp: 20,
        description: 'Clear sky',
        icon: '01d',
        timeUpdate: 1618317047,
    };
    beforeEach(() => {
        localStorage.clear();
    });
    test('should cache weather data', () => {
        setCachedWeather(city, mockWeatherData);
        const cachedData = getCachedWeather(city);
        expect(cachedData).toEqual(mockWeatherData);
    });
    test('should return null if cache is expired', () => {
        localStorage.setItem('weather_cache', JSON.stringify({
            [city]: {
                data: mockWeatherData,
                timestamp: Date.now() - 310000,
            },
        }));
        const cachedData = getCachedWeather(city);
        expect(cachedData).toBeNull();
    });
});
