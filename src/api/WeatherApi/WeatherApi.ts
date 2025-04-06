import axios from 'axios';

const API_KEY = '3b09437c099b97266d5731571ad14a94';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherApiResponse {
    name: string;
    main: {
        temp: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
    dt: number;
}

export const fetchWeather = async (city: string): Promise<WeatherApiResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
                lang: 'en',
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('City not found');
        } else if (error.response?.status === 500)
            throw new Error('Server error');
        else throw new Error('Unknown error')
    }
};
