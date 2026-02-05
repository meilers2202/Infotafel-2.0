"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import weatherInterpretationCodes, { importAnimatedIcon } from '../weatherInterpretationCodes';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_APP_API_URL + "cache";

function Weather({ isActive }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerIconData, setHeaderIconData] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/weather`);
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadHeaderIcon = async () => {
      if (!weatherData) return;
      try {
        const code = activeDayIndex === 0 ? weatherData.current.weather_code : weatherData.daily.weather_code[activeDayIndex];
        const isDay = activeDayIndex === 0 ? (weatherData.current.is_day === 1) : true;
        const period = isDay ? "day" : "night";
        const iconName = weatherInterpretationCodes[code]?.[period]?.animated;

        if (iconName) {
          const iconJson = await importAnimatedIcon(iconName);
          setHeaderIconData(iconJson);
        }
      } catch (error) {
        console.error("Error loading animated icon:", error);
      }
    };
    loadHeaderIcon();
  }, [weatherData, activeDayIndex]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.stopPropagation();
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDown.current = false;
  };

  if (loading || !weatherData) return <div className="text-white/50 text-center py-20 animate-pulse font-bold tracking-widest text-xs">LADE WETTERDATEN...</div>;

  const { daily, hourly, current } = weatherData;
  const start = activeDayIndex * 24;
  const selectedHourly = {
    time: hourly.time.slice(start, start + 24),
    temp: hourly.temperature_2m.slice(start, start + 24),
  };

  const dayCode = activeDayIndex === 0 ? current.weather_code : daily.weather_code[activeDayIndex];
  const info = weatherInterpretationCodes[dayCode]?.day;
  const formatTime = (unix) => new Date(unix * 1000).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 w-full h-screen overflow-y-auto bg-transparent text-white custom-scrollbar-v px-4 select-none">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 py-0 md:py-0 mt-[5vh]">
        
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl flex flex-col lg:flex-row gap-8 items-center shrink-0">
          <div className="flex-1 text-center lg:text-left flex flex-col justify-center">
            <p className="text-blue-400/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              {activeDayIndex === 0 ? "Heute • Chemnitz" : new Date(daily.time[activeDayIndex] * 1000).toLocaleDateString("de-DE", { weekday: 'long', day: '2-digit', month: 'long' })}
            </p>
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter leading-none">
              {info?.desc || "Sonnig"}
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <span className="text-6xl md:text-8xl font-black tabular-nums">
                {activeDayIndex === 0 ? Math.round(current.temperature_2m) : Math.round(daily.temperature_2m_max[activeDayIndex])}°
              </span>
              {headerIconData && (
                <div className="w-24 h-24 md:w-36 md:h-36">
                  <Lottie animationData={headerIconData} loop={true} />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <DetailCard label="Wind" value={`${daily.wind_speed_10m_max[activeDayIndex]} km/h`} />
            <DetailCard label="Regen" value={`${daily.precipitation_sum[activeDayIndex]} mm`} />
            <DetailCard label="UV Index" value={`${daily.uv_index_max[activeDayIndex]}`} />
            <DetailCard label="Chance" value={`${daily.precipitation_probability_max[activeDayIndex]}%`} />
            <DetailCard label="Aufgang" value={formatTime(daily.sunrise[activeDayIndex])} />
            <DetailCard label="Untergang" value={formatTime(daily.sunset[activeDayIndex])} />
          </div>
        </div>

        <div className="w-full shrink-0 no-drag" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40 ml-4">Vorschau</h3>
          <div className="overflow-x-auto no-scrollbar pb-2 touch-pan-x">
            <div className="flex gap-3 min-w-max px-2">
              {daily.time.map((time, index) => (
                <button
                  key={time}
                  onClick={() => setActiveDayIndex(index)}
                  className={`flex flex-col items-center w-[110px] md:w-[130px] p-5 rounded-[2rem] transition-all duration-300 border-2 shrink-0 ${
                    activeDayIndex === index 
                    ? "bg-blue-600 border-blue-400 shadow-xl scale-[1.02]" 
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase opacity-50 mb-2">{index === 0 ? "Heute" : new Date(time * 1000).toLocaleDateString("de-DE", { weekday: 'short' })}</span>
                  <span className="text-3xl mb-2">{daily.weather_code[index] > 50 ? "🌧️" : "☀️"}</span>
                  <div className="flex flex-col items-center">
                     <span className="text-xl font-black">{Math.round(daily.temperature_2m_max[index])}°</span>
                     <span className="text-[10px] opacity-40 font-bold">{Math.round(daily.temperature_2m_min[index])}°</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div 
          className="bg-black/20 backdrop-blur-md rounded-[3rem] p-6 md:p-8 border border-white/5 shrink-0 mb-10 overflow-hidden no-drag"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-40 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Stündlicher Verlauf
          </h3>
          
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseUp={handleMouseUpOrLeave}
            onMouseMove={handleMouseMove}
            className="overflow-x-auto no-scrollbar pb-4 cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-4 min-w-max px-2 pointer-events-none">
              {selectedHourly.time.map((t, i) => (
                <div key={t} className="flex flex-col items-center w-[60px] shrink-0">
                  <span className="text-[11px] text-gray-500 font-bold mb-4">{new Date(t * 1000).getHours()}:00</span>
                  <div className="w-2.5 bg-white/5 h-28 rounded-full relative mb-4 overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out" 
                      style={{ height: `${Math.max(15, (selectedHourly.temp[i] / 40) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="font-black text-sm">{Math.round(selectedHourly.temp[i])}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="h-20 shrink-0"></div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar-v::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-v::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:bg-white/10 transition-colors shrink-0">
      <span className="text-[9px] md:text-[10px] uppercase font-black text-gray-400 mb-1 tracking-wider text-center">{label}</span>
      <span className="text-sm md:text-base font-black tabular-nums">{value}</span>
    </div>
  );
}

export default Weather;