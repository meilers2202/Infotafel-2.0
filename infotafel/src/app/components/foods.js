"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dotenv from 'dotenv'

dotenv.config();

function Foods({ isActive }) {
  const [loading, setLoading] = useState(true);
  const [mealPlan, setMealPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // Für die Auswahl im Dropdown

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_APP_API_URL + "cache/food");
        setMealPlan(Array.isArray(response.data) ? response.data : []);
        if (response.data.length > 0) {
          setSelectedDay(response.data[0].date); // Standardmäßig den ersten Tag auswählen
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(mealPlan)
  // Accessibility settings
  const tabIndexValue = isActive ? 0 : -1; // Only focusable when active
  const ariaHiddenValue = !isActive; // Hidden from screen readers when inactive

  return (
    <div className="flex flex-col justify-center min-h-full" aria-hidden={ariaHiddenValue}>
      {/* Loading state */}
      {loading && (
        <div
          className="text-2xl mx-auto self-center flex items-center justify-center text-gray-300"
          tabIndex={tabIndexValue}
        >
          <div className="loader ease-linear rounded-full border-4 border-t-4 h-12 w-12 mr-4"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Mobile Ansicht mit Dropdown */}
      {!loading && mealPlan && mealPlan.length > 0 && (
        <div className="sm:hidden m-4">
          <label htmlFor="day-selector" className="block text-white mb-2">
            Wähle einen Tag:
          </label>
          <select
            id="day-selector"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
          >
            {mealPlan.map((day) => (
              <option key={day.date} value={day.date}>
                {day.date}
              </option>
            ))}
          </select>

          {/* Inhalt für den ausgewählten Tag */}
          {mealPlan
            .filter((day) => day.date === selectedDay)
            .map((day) => (
              <div
                key={day.date}
                className="m-4 p-4 bg-gray-800 rounded-lg text-white"
              >
                <h1 className="text-2xl font-bold">{day.date}</h1>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {day.meals?.menus?.menuName?.length > 0 ? (
                    day.meals.menus.menuName.map((meal, mealIndex) => (
                      <div
                        key={mealIndex}
                        className="p-4 rounded-md bg-gray-700"
                      >
                        <p>{meal}</p>
                        {day.meals.menus.alergenes[mealIndex] && (
                          <p className="text-sm text-gray-400 mt-2">
                            Allergene: {day.meals.menus.alergenes[mealIndex]}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">Keine Mahlzeiten verfügbar</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Desktop Ansicht */}
      {!loading && mealPlan && mealPlan.length > 0 && (
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ml-6 mr-6">
          {mealPlan.map((day) => (
            <div
              className="font-bold p-6 shadow-sm rounded-lg transition-transform transform hover:scale-105 duration-200 hover:shadow-lg"
              key={day.date}
              tabIndex={tabIndexValue}
              aria-hidden={ariaHiddenValue}
            >
              <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl text-white">
                {day.date}
              </h1>
              <br/>
              <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-white">
                Gericht
              </h2>
              <div className="font-medium text-base sm:text-lg mt-4 text-gray-300">
                {day.meals &&
                day.meals.menus &&
                Array.isArray(day.meals.menus.menuName) &&
                day.meals.menus.menuName.length > 0 ? (
                  day.meals.menus.menuName.map((meal, mealIndex) => (
                    <div
                      className="p-4 mt-2 rounded-md bg-gray-700 h-36 flex flex-col justify-between"
                      key={mealIndex}
                      aria-hidden={ariaHiddenValue}
                    >
                      <p
                        className="text-sm sm:text-base md:text-lg text-gray-200"
                        tabIndex={tabIndexValue}
                      >
                        {meal}
                      </p>
                      {day.meals.menus.alergenes[mealIndex] && (
                        <p
                          className="text-xs sm:text-sm mt-2 text-gray-400"
                          tabIndex={tabIndexValue}
                        >
                          Allergene: {day.meals.menus.alergenes[mealIndex]}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No meals available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && mealPlan && mealPlan.length > 0 && (
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ml-6 mr-6">
          {mealPlan.map((day) => (
            <div
              className="font-bold p-6 shadow-sm rounded-lg transition-transform transform hover:scale-105 duration-200 hover:shadow-lg"
              key={day.date}
              tabIndex={tabIndexValue}
              aria-hidden={ariaHiddenValue}
            >
              <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-white">
                Suppe
              </h2>
              <div className="font-medium text-base sm:text-lg mt-4 text-gray-300">
                {day.meals &&
                day.meals.soup &&
                Array.isArray(day.meals.soup.soupName) &&
                day.meals.soup.soupName.length > 0 ? (
                  day.meals.soup.soupName.map((meal, mealIndex) => (
                    <div
                      className="p-4 mt-2 rounded-md bg-gray-700 h-36 flex flex-col justify-between"
                      key={mealIndex}
                      aria-hidden={ariaHiddenValue}
                    >
                      <p
                        className="text-sm sm:text-base md:text-lg text-gray-200"
                        tabIndex={tabIndexValue}
                      >
                        {meal}
                      </p>
                      {day.meals.soup.alergens[mealIndex] && (
                        <p
                          className="text-xs sm:text-sm mt-2 text-gray-400"
                          tabIndex={tabIndexValue}
                        >
                          Allergene: {day.meals.soup.alergens[mealIndex]}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No meals available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No meal plan available */}
      {!loading && (!mealPlan || mealPlan.length === 0) && (
        <div className="text-2xl mx-auto self-center text-gray-300" tabIndex={tabIndexValue}>
          <p>No meal plan available</p>
        </div>
      )}
    </div>
  );
}

export default Foods;