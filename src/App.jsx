import { useState, useEffect, useCallback } from "react";
import WeatherCard from "./weathercard";

const DEFAULT_CITY = "Delhi, IN";

function WeatherApp() {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = useCallback(
    async (query) => {
      if (!query) return;

      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=1&aqi=no&alerts=no`
        );

        if (!res.ok) throw new Error("City not found");

        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setWeather(null);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  useEffect(() => {
    fetchWeather(DEFAULT_CITY);
  }, [fetchWeather]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <WeatherCard
        data={weather}
        apiKey={apiKey}
        onSelect={fetchWeather}
        loading={isLoading}
        error={error}
      />
    </div>
  );
}

export default WeatherApp;
