"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react";
// Hinweis: dotenv wird in Next.js Client Components normalerweise nicht benötigt, 
// da NEXT_PUBLIC_ Variablen automatisch geladen werden.
import weatherInterpretationCodes, { importAnimatedIcon } from '../weatherInterpretationCodes';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_APP_API_URL + "cache";
const debug = false;

function Weather({ isActive }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIconData, setCurrentIconData] = useState(null); // State für das Lottie-JSON

  // 1. Wetterdaten vom Backend laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherResponse = await axios.get(`${API_BASE_URL}/weather`);

        if (debug) {
          console.log("Weather data:", weatherResponse.data);
        }

        setWeatherData(weatherResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Icon laden, sobald Wetterdaten verfügbar sind
  useEffect(() => {
    const loadWeatherIcon = async () => {
      if (weatherData?.current) {
        try {
          const code = weatherData.current.weather_code;
          const isDay = weatherData.current.is_day === 1;
          
          // Bestimme den Icon-Namen aus der Konfigurationsdatei
          const period = isDay ? "day" : "night";
          const iconName = weatherInterpretationCodes[code]?.[period]?.animated;

          if (iconName) {
            const iconJson = await importAnimatedIcon(iconName);
            setCurrentIconData(iconJson);
          }
        } catch (error) {
          console.error("Error loading animated icon:", error);
        }
      }
    };

    loadWeatherIcon();
  }, [weatherData]);

  const tabIndexValue = isActive ? 0 : -1;
  const ariaHiddenValue = !isActive;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen" aria-hidden={ariaHiddenValue}>
        <div className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl" tabIndex={tabIndexValue}>
          Loading...
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen" aria-hidden={ariaHiddenValue}>
        <div className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl" tabIndex={tabIndexValue}>
          Error: Data not available
        </div>
      </div>
    );
  }

  // Bestimme aktuelle Info für die Anzeige (Beschreibung)
  const isDay = weatherData.current?.is_day === 1;
  const currentInfo = weatherInterpretationCodes[weatherData.current?.weather_code]?.[isDay ? "day" : "night"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" aria-hidden={ariaHiddenValue}>
      <div className="flex flex-col items-center w-full sm:max-w-screen-lg" tabIndex={-1}>
        <div className="flex flex-col sm:flex-row w-full sm:justify-evenly items-center" aria-hidden={ariaHiddenValue}>
          
          <div className="transition-transform transform hover:scale-105 duration-200 w-full sm:w-auto sm:mr-12 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white m-6" tabIndex={tabIndexValue}>
              {currentInfo?.desc || "Unbekanntes Wetter"}
            </h1>
            
            {/* Hier wird das dynamisch geladene Icon angezeigt */}
            {currentIconData ? (
              <Lottie
                animationData={currentIconData}
                loop={true}
                className="w-40 h-40 sm:w-64 sm:h-64 mx-auto sm:mx-0"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center text-white opacity-50 mx-auto">
                Lade Icon...
              </div>
            )}
          </div>

          <div className="text-white flex flex-col items-center sm:items-start w-full sm:w-auto">
            <div className="flex flex-col justify-evenly items-center sm:items-start w-full">
              
              {/* Temperatur */}
              <p className="transition-transform transform hover:scale-105 duration-200 flex flex-row items-center text-4xl sm:text-5xl my-4" tabIndex={tabIndexValue}>
                <img src="weather/staticLogos/thermometer.svg" className="w-12 h-auto mr-4" alt="Temperature" style={{ filter: "invert(80%) sepia(63%) saturate(2257%) hue-rotate(350deg) brightness(102%) contrast(107%)" }} />
                {weatherData.current?.temperature_2m}°C
              </p>

              {/* Wind */}
              <p className="transition-transform transform hover:scale-105 duration-200 flex flex-row items-center text-4xl sm:text-5xl my-4" tabIndex={tabIndexValue}>
                <img src="weather/staticLogos/wind.svg" className="w-12 h-auto mr-4" alt="Wind Speed" style={{ filter: "invert(80%) sepia(63%) saturate(2257%) hue-rotate(350deg) brightness(102%) contrast(107%)" }} />
                {weatherData.current?.wind_speed_10m} KM/h
              </p>

              {/* Bewölkung */}
              <p className="transition-transform transform hover:scale-105 duration-200 flex flex-row items-center text-4xl sm:text-5xl my-4" tabIndex={tabIndexValue}>
                <img src="weather/staticLogos/clouds.svg" className="w-12 h-auto mr-4" alt="Cloud Cover" style={{ filter: "invert(80%) sepia(63%) saturate(2257%) hue-rotate(350deg) brightness(102%) contrast(107%)" }} />
                {weatherData.current?.cloud_cover}%
              </p>

              {/* Regen */}
              <p className="transition-transform transform hover:scale-105 duration-200 flex flex-row items-center text-4xl sm:text-5xl my-4" tabIndex={tabIndexValue}>
                <img src="weather/staticLogos/moderate-rain.svg" alt="Rain" className="w-12 h-auto mr-4" style={{ filter: "invert(80%) sepia(63%) saturate(2257%) hue-rotate(350deg) brightness(102%) contrast(107%)" }} />
                {weatherData.current?.rain} mm
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;