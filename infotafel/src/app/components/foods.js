"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

function Foods({ isActive }) {
  const [loading, setLoading] = useState(true);
  const [mealPlan, setMealPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_APP_API_URL + "cache/food");
        setMealPlan(Array.isArray(response.data) ? response.data : []);
        if (response.data && response.data.length > 0) {
          setSelectedDay(response.data[0].date);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabIndexValue = isActive ? 0 : -1;
  const ariaHiddenValue = !isActive;

  return (
    <div 
      className="flex flex-col w-full h-screen overflow-y-auto pt-2 sm:py-8 custom-scrollbar-v" 
      aria-hidden={ariaHiddenValue}
    >
      {loading && (
        <div
          className="text-2xl mx-auto self-center flex flex-col items-center justify-center text-gray-300 min-h-[50vh]"
          tabIndex={tabIndexValue}
        >
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-600 h-12 w-12 mb-4"></div>
          <p>Lade Speiseplan...</p>
        </div>
      )}

      {!loading && mealPlan && mealPlan.length > 0 && (
        <div className="sm:hidden px-4 pb-32">
          <div className="bg-gray-800 p-4 rounded-xl shadow-xl">
            <label htmlFor="day-selector" className="block text-gray-400 text-sm font-medium mb-2">
              Tag auswählen:
            </label>
            <select
              id="day-selector"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="no-drag w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {mealPlan.map((day) => (
                <option key={day.date} value={day.date}>
                  {day.date}
                </option>
              ))}
            </select>

            {mealPlan
              .filter((day) => day.date === selectedDay)
              .map((day) => (
                <div key={day.date} className="mt-6 space-y-2">
                  <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">{day.date}</h2>
                  {day.meals?.menus?.menuName?.length > 0 ? (
                    day.meals.menus.menuName.map((meal, mealIndex) => (
                      <div
                        key={mealIndex}
                        className="p-4 rounded-xl bg-gray-700 border-l-4 border-blue-500 shadow-inner"
                      >
                        <span className="text-blue-400 font-bold text-xs uppercase mb-1 block">
                          {mealIndex + 1}. Gericht
                        </span>
                        <p className="text-gray-100 leading-relaxed whitespace-pre-line text-sm">{meal}</p>
                        {day.meals?.menus?.alergenes?.[mealIndex] && (
                          <div className="mt-3 pt-2 border-t border-gray-600">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Allergene</span>
                            <p className="text-xs text-gray-300 italic">{day.meals.menus.alergenes[mealIndex]}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">Keine Mahlzeiten verfügbar</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {!loading && mealPlan && mealPlan.length > 0 && (
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-6 pb-32">
          {mealPlan.map((day) => (
            <div
              key={day.date}
              className="flex flex-col bg-gray-800 rounded-2xl p-5 shadow-lg border border-white/5"
              tabIndex={tabIndexValue}
            >
              <h2 className="text-xl font-bold text-blue-400 mb-4 pb-2 border-b border-gray-700">
                {day.date}
              </h2>
              <div className="flex flex-col gap-4">
                {day.meals?.menus?.menuName?.length > 0 ? (
                  day.meals.menus.menuName.map((meal, mealIndex) => (
                    <div
                      key={mealIndex}
                      className="group flex flex-col bg-gray-900/40 p-4 rounded-xl border border-transparent"
                    >
                      <span className="text-blue-400/80 font-bold text-[10px] uppercase mb-1">
                        {mealIndex + 1}. Gericht
                      </span>
                      <p className="text-sm text-gray-200 leading-snug whitespace-pre-line mb-auto">
                        {meal}
                      </p>
                      {day.meals?.menus?.alergenes?.[mealIndex] && (
                        <div className="mt-3">
                          <p className="text-[10px] font-bold text-blue-300 uppercase">Allergene</p>
                          <p className="text-[11px] text-gray-400">
                            {day.meals.menus.alergenes[mealIndex]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">Kein Plan verfügbar</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar-v::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-v::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .loader { border-top-color: #3498db; animation: spinner 1.5s linear infinite; }
        @keyframes spinner { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Foods;