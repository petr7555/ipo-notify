import axios from 'axios';
import * as functions from 'firebase-functions';

const WEATHER_API_KEY = functions.config().weatherapi.key;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const getWeatherData = async (city: string) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const data = response.data;
    return {
      maxTemperature: data.main.temp_max,
      minTemperature: data.main.temp_min,
      temperature: data.main.temp,
      weatherIcon: `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`,
      weatherName: data.weather[0].main,
      windSpeed: data.wind.speed,
    };
  } catch (e) {
    console.error("Couldn't get weather data:", e);
  }
};

export default getWeatherData;
