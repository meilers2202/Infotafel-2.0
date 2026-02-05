"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LocInfo({ isActive }) {
  const [locInfo, setLocInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Exakt deine Original-URL
        const response = await axios.get("http://localhost:1337/api/betreuers?");
        setLocInfo(response.data.data);
      } catch (e) {
        console.log("The API request failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ariaHiddenValue = !isActive;

  return (
    <div
      className="flex flex-col w-full h-screen overflow-y-auto pt-8 pb-32 custom-scrollbar-v"
      aria-hidden={ariaHiddenValue}
    >
      {loading ? (
        <div className="flex justify-center mt-20 text-gray-400 animate-pulse">
          Lade Informationen...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-[1200px] mx-auto w-full">
          {locInfo && locInfo.map((item, index) => {
            // Strapi nutzt oft .attributes, falls dein Original direkt data nutzt:
            const data = item.attributes || item;

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-gray-800/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl transition-transform hover:scale-105"
              >
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
                    {data.WG}
                  </h1>
                  <div className="h-1 w-12 bg-blue-500 mx-auto mt-1 rounded-full"></div>
                </div>

                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-center space-x-3 bg-black/20 py-2 px-4 rounded-lg">
                    <img
                      src="https://img.icons8.com/ios-filled/50/ffffff/user.png"
                      alt="Betreuer"
                      className="w-5 h-5"
                    />
                    <h2 className="text-lg font-medium text-gray-300">
                      {data.Betreuer}
                    </h2>
                  </div>

                  <div className="flex items-center justify-center space-x-3 bg-black/20 py-2 px-4 rounded-lg">
                    <img
                      src="https://img.icons8.com/ios-filled/50/ffffff/phone.png"
                      alt="Telefon"
                      className="w-5 h-5"
                    />
                    <h2 className="text-md text-gray-400 font-mono">
                      {data.Telefon}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar-v::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-v::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}