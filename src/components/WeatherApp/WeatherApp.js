import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { fetchWeather } from '../../api/WeatherApi/WeatherApi';
import { getCachedWeather, setCachedWeather } from '../../utils/Cache/Cache';
const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSearchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            let data = getCachedWeather(city);
            if (!data) {
                const dataFetch = await fetchWeather(city);
                const parsedWeather = {
                    name: dataFetch.name,
                    temp: dataFetch.main.temp,
                    description: dataFetch.weather[0].description,
                    icon: dataFetch.weather[0].icon,
                    timeUpdate: dataFetch.dt,
                };
                setCachedWeather(city, parsedWeather);
                setWeather(parsedWeather);
            }
            else {
                setWeather(data);
            }
        }
        catch (err) {
            if (err.message === 'City not found') {
                setError('City not found. Please try another city.');
            }
            else if (err.message === 'Server error') {
                setError('Server not responding. Please try again later.');
            }
            else {
                setError('An error occurred. Please try again.');
            }
            setWeather(null);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Card, { sx: { maxWidth: 400, mx: 'auto', mt: 4, p: 2, boxShadow: 10 }, children: _jsxs(CardContent, { children: [_jsx(TextField, { label: "Enter city", fullWidth: true, value: city, onChange: (e) => setCity(e.target.value), sx: { mb: 2 } }), _jsx(Button, { variant: "contained", fullWidth: true, onClick: handleSearchWeather, disabled: loading, children: "Get Weather" }), loading && _jsx(CircularProgress, { sx: { display: 'block', mx: 'auto', mt: 2 } }), error && _jsx(Alert, { severity: "error", sx: { mt: 2 }, children: error }), weather && (_jsx(Card, { sx: { mt: 2, textAlign: 'center' }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h5", children: weather.name }), _jsxs(Typography, { variant: "h6", children: [weather.temp, "\u00B0C"] }), _jsx(Typography, { children: weather.description }), _jsx("img", { src: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`, alt: "weather icon" }), _jsxs(Typography, { variant: "caption", children: ["Last updated: ", new Date(weather.timeUpdate * 1000).toLocaleTimeString()] })] }) }))] }) }));
};
export default WeatherApp;
