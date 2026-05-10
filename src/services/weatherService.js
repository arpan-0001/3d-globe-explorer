import axios from 'axios';
import { WEATHER_API_KEY } from '../config';
console.log('API KEY in use:', WEATHER_API_KEY);


export async function getWeather(city) {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`
    );
    return res.data;
  } catch (err) {
    console.warn("Weather API error:", err.message);
    return null;
  }
}
