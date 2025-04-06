import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherApp from './WeatherApp';
import { fetchWeather } from '../../api/WeatherApi/WeatherApi';
import { getCachedWeather } from '../../utils/Cache/Cache';
jest.mock('../../api/WeatherApi/WeatherApi');
jest.mock('../../utils/Cache/Cache');
describe('WeatherApp', () => {
    const mockWeatherDataFetch = {
        name: 'Kyiv',
        main: { temp: 20 },
        weather: [{ description: 'Clear sky', icon: '01d' }],
        dt: 1618317047,
    };
    const mockWeatherData = {
        name: 'Kyiv',
        temp: 20,
        description: 'Clear sky',
        icon: '01d',
        timeUpdate: 1618317047,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should show error message when an incorrect city is entered', async () => {
        fetchWeather.mockRejectedValue({ message: 'City not found' });
        render(_jsx(WeatherApp, {}));
        const input = screen.getByLabelText('Enter city');
        const button = screen.getByRole('button', { name: /get weather/i });
        fireEvent.change(input, { target: { value: 'InvalidCity' } });
        fireEvent.click(button);
        await waitFor(() => screen.getByText(/City not found/));
        expect(screen.getByText(/City not found/)).toBeInTheDocument();
    });
    test('should display weather data correctly', async () => {
        fetchWeather.mockResolvedValue(mockWeatherDataFetch);
        render(_jsx(WeatherApp, {}));
        const input = screen.getByLabelText('Enter city');
        const button = screen.getByRole('button', { name: /get weather/i });
        fireEvent.change(input, { target: { value: 'Kyiv' } });
        fireEvent.click(button);
        const cityName = await screen.findByText(/Kyiv/);
        const temperature = await screen.findByText(/20°C/);
        const description = await screen.findByText(/Clear sky/);
        expect(cityName).toBeInTheDocument();
        expect(temperature).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    });
    test('should use cached data if available', async () => {
        getCachedWeather.mockReturnValue(mockWeatherData);
        fetchWeather.mockResolvedValue(undefined);
        render(_jsx(WeatherApp, {}));
        const input = screen.getByLabelText('Enter city');
        const button = screen.getByRole('button', { name: /get weather/i });
        fireEvent.change(input, { target: { value: 'Kyiv' } });
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText('Kyiv')).toBeInTheDocument();
            expect(screen.getByText('20°C')).toBeInTheDocument();
            expect(screen.getByText('Clear sky')).toBeInTheDocument();
        });
    });
});
