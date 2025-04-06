import {useState} from 'react';
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import {fetchWeather} from '../../api/WeatherApi/WeatherApi';
import {getCachedWeather, setCachedWeather} from '../../utils/Cache/Cache';

export interface WeatherData {
    name: string;
    temp: number;
    description: string;
    icon: string;
    timeUpdate: number;
}

const WeatherApp = () => {
    const [city, setCity] = useState<string>('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearchWeather = async () => {
        setLoading(true);
        setError(null);

        try {
            let data: WeatherData | null = getCachedWeather(city);

            if (!data) {
                const dataFetch = await fetchWeather(city);

                const parsedWeather: WeatherData = {
                    name: dataFetch.name,
                    temp: dataFetch.main.temp,
                    description: dataFetch.weather[0].description,
                    icon: dataFetch.weather[0].icon,
                    timeUpdate: dataFetch.dt,
                };

                setCachedWeather(city, parsedWeather);
                setWeather(parsedWeather);
            } else {
                setWeather(data);
            }

        } catch (err: any) {
            if (err.message === 'City not found') {
                setError('City not found. Please try another city.');
            } else if (err.message === 'Server error') {
                setError('Server not responding. Please try again later.');
            } else {
                setError('An error occurred. Please try again.');
            }
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{maxWidth: 400, mx: 'auto', mt: 4, p: 2, boxShadow: 10}}>
            <CardContent>
                <TextField
                    label="Enter city"
                    fullWidth
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{mb: 2}}
                />
                <Button variant="contained" fullWidth onClick={handleSearchWeather} disabled={loading}>
                    Get Weather
                </Button>

                {loading && <CircularProgress sx={{display: 'block', mx: 'auto', mt: 2}}/>}
                {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}

                {weather && (
                    <Card sx={{mt: 2, textAlign: 'center'}}>
                        <CardContent>
                            <Typography variant="h5">{weather.name}</Typography>
                            <Typography variant="h6">{weather.temp}°C</Typography>
                            <Typography>{weather.description}</Typography>
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                alt="weather icon"
                            />
                            <Typography variant="caption">
                                Last updated: {new Date(weather.timeUpdate * 1000).toLocaleTimeString()}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};

export default WeatherApp;
