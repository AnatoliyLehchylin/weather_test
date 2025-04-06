import {fetchWeather, WeatherApiResponse} from '../../api/WeatherApi/WeatherApi';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeather', () => {
    test('should fetch weather data for a valid city', async () => {
        const city = 'Kyiv';
        const mockResponse: { data: WeatherApiResponse } = {
            data: {
                name: 'Kyiv',
                main: {temp: 20},
                weather: [{description: 'Clear sky', icon: '01d'}],
                dt: 1618317047,
            },
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await fetchWeather(city);
        expect(result).toEqual(mockResponse.data);
    });

    test('should throw an error for an invalid city', async () => {
        const city = 'InvalidCity';
        const mockError = {response: {status: 404}};

        mockedAxios.get.mockRejectedValue(mockError);

        await expect(fetchWeather(city)).rejects.toThrow('City not found');
    });
});
