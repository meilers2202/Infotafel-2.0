"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Plan({ isActive = true }) {
  const [fachrichtung, setFachrichtung] = useState("BVB");
  const [jobList, setJobList] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [loading, setLoading] = useState(true);

  const selectRef = useRef(null);
  const tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  const stunden = Array.from({ length: 10 }, (_, i) => i + 1);

  const tabIndexValue = isActive ? 0 : -1;
  const ariaHiddenValue = !isActive;

  // Berufsliste laden
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_APP_API_URL || "http://localhost:1337/";
        const response = await axios.get(`${baseUrl}api/berufe`);
        const jobsData = response.data.data;

        if (jobsData && jobsData.length > 0) {
          const jobNames = jobsData
            .map((job) => job.attributes?.Name || job.Name || "Unnamed Job")
            .sort((a, b) => a.localeCompare(b));
          setJobList(jobNames);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Daten für die ganze Woche laden
  useEffect(() => {
    if (!fachrichtung) return;

    const fetchWeeklyData = async () => {
      setLoading(true);
      const newWeeklyPlan = {};
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_APP_API_URL || "http://localhost:1337/";

      // Wir holen uns das Datum vom Montag der aktuellen Woche
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 (So) bis 6 (Sa)
      const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diffToMonday));

      try {
        // Wir iterieren über 5 Tage (Mo-Fr)
        for (let i = 0; i < 5; i++) {
          const currentDay = new Date(monday);
          currentDay.setDate(monday.getDate() + i);
          const dateStr = currentDay.toISOString().split("T")[0];

          const response = await axios.get(
            `${baseUrl}api/stundenplaene?populate=*&filters[beruf][Name][$eq]=${fachrichtung}&filters[Datum][$eq]=${dateStr}`
          );

          // Daten mappen (Stunde als Key für schnellen Zugriff)
          const dayData = response.data.data[0]?.attributes?.Vertretungsplan || response.data.data[0]?.Vertretungsplan || [];
          const mappedDay = {};
          dayData.forEach(item => {
            mappedDay[item.Stunde] = item.Text;
          });

          newWeeklyPlan[tage[i]] = mappedDay;
        }
        setWeeklyPlan(newWeeklyPlan);
      } catch (error) {
        console.error("Error fetching weekly data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [fachrichtung]);

  return (
    <div
      className="flex flex-col w-full h-screen overflow-y-auto pt-8 pb-32 custom-scrollbar-v"
      aria-hidden={ariaHiddenValue}
    >
      <div className="max-w-[1400px] mx-auto w-full px-4">
        
        {/* Dropdown */}
        <div className="mb-8 flex justify-center">
          <select
            ref={selectRef}
            className="w-full sm:w-1/2 md:w-1/3 p-3 text-lg font-bold text-yellow-500 bg-gray-900 rounded-xl border-2 border-yellow-500/50 focus:border-yellow-500 outline-none transition-all shadow-lg"
            value={fachrichtung}
            onChange={(e) => setFachrichtung(e.target.value)}
            tabIndex={tabIndexValue}
          >
            {jobList.map((job, index) => (
              <option key={index} value={job}>{job}</option>
            ))}
          </select>
        </div>

        {/* Wochenplan Tabelle */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-600">
                  <th className="p-4 text-black font-black uppercase text-sm border-r border-black/10 w-20">Std.</th>
                  {tage.map(tag => (
                    <th key={tag} className="p-4 text-black font-bold uppercase text-sm border-r border-black/10">
                      {tag}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stunden.map((stunde) => (
                  <tr key={stunde} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-2 text-center font-bold text-yellow-500 bg-black/20 border-r border-white/10">
                      {stunde}
                    </td>
                    {tage.map(tag => {
                      const text = weeklyPlan[tag]?.[stunde];
                      return (
                        <td key={tag} className="p-1 text-center border-r border-white/10 min-w-[150px]">
                          {loading ? (
                            <div className="h-4 w-12 bg-white/10 animate-pulse mx-auto rounded"></div>
                          ) : (
                            <span className={`text-sm ${text ? "text-white font-medium" : "text-gray-600"}`}>
                              {text || "-"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6 uppercase tracking-[0.2em]">
          Vertretungsplan • Wochenansicht
        </p>
      </div>

      <style jsx>{`
        .custom-scrollbar-v::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar-v::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        tr:last-child { border-bottom: none; }
      `}</style>
    </div>
  );
}