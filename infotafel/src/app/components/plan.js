import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

export default function Plan({ isActive = true }) {
  const [fachrichtung, setFachrichtung] = useState("BVB");
  const [jobList, setJobList] = useState([]);
  const [planToday, setPlanToday] = useState([]);
  const [planTomorrow, setPlanTomorrow] = useState([]);

  const selectRef = useRef(null); // Reference to the select element

  // Accessibility settings
  const tabIndexValue = isActive ? 0 : -1; // Only focusable when active
  const ariaHiddenValue = !isActive; // Hide from screen readers when inactive

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_STRAPI_APP_API_URL + `api/berufe`);
        const jobsData = response.data.data;

        if (jobsData && jobsData.length > 0) {
          const jobNames = jobsData
            .map((job) => job.Name || "Unnamed Job")
            .sort((a, b) => a.localeCompare(b));
          setJobList(jobNames);
        } else {
          console.log("No jobs found.");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Numpad8") {
        // Move up through the select options when Numpad8 is pressed
        if (selectRef.current) {
          const currentIndex = selectRef.current.selectedIndex;
          if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            selectRef.current.selectedIndex = newIndex;
            setFachrichtung(selectRef.current.value); // Update fachrichtung
          }
        }
      } else if (event.code === "Numpad2") {
        // Move down through the select options when Numpad2 is pressed
        if (selectRef.current) {
          const currentIndex = selectRef.current.selectedIndex;
          if (currentIndex < selectRef.current.options.length - 1) {
            const newIndex = currentIndex + 1;
            selectRef.current.selectedIndex = newIndex;
            setFachrichtung(selectRef.current.value); // Update fachrichtung
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fachrichtung]);

  useEffect(() => {
    if (!fachrichtung) return;

    const fetchData = async () => {
      try {
        const dateToday = new Date().toISOString().split("T")[0];
        const dateTomorrow = new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0];

        const todayResponse = await axios.get(
          process.env.NEXT_PUBLIC_STRAPI_APP_API_URL + `api/stundenplaene?populate=*&filters[beruf][$eq]=${fachrichtung}&filters[Datum][$eq]=${dateToday}`
        );
        const tomorrowResponse = await axios.get(
          process.env.NEXT_PUBLIC_STRAPI_APP_API_URL + `api/stundenplaene?populate=*&filters[beruf][$eq]=${fachrichtung}&filters[Datum][$eq]=${dateTomorrow}`
        );

        const todayData = todayResponse.data.data || [];
        const tomorrowData =
          tomorrowResponse.data.data || [];

        if (todayData.length > 0) {
          todayData.sort((a, b) => a.Stunde - b.Stunde);
          setPlanToday(todayData);
        } else {
          setPlanToday([]);
        }

        if (tomorrowData.length > 0) {
          tomorrowData.sort((a, b) => a.Stunde - b.Stunde);
          setPlanTomorrow(tomorrowData);
        } else {
          setPlanTomorrow([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fachrichtung]);

  return (
    <div
      className="flex flex-col items-center p-6 space-y-8 sm:mt-24"
      aria-hidden={ariaHiddenValue}
      role="region"
      aria-labelledby="plan-title"
      lang="de"
    >
      <h1 id="plan-title" className="sr-only">
        Vertretungsplan
      </h1>

      {/* Dropdown for job selection */}
      <div className="w-full max-w-screen-lg">
        <select
          ref={selectRef}
          id="job-select"
          className="w-full sm:w-1/3 p-2 text-lg font-bold text-yellow-500 bg-black rounded-lg focus:outline-none border border-white"
          value={fachrichtung}
          onChange={(e) => setFachrichtung(e.target.value)}
          tabIndex={tabIndexValue}
          aria-hidden={ariaHiddenValue}
        >
          {jobList.map((job, index) => (
            <option key={index} value={job}>
              {job}
            </option>
          ))}
        </select>
      </div>

      {/* Today and Tomorrow Sections */}
      {["Heute", "Morgen"].map((day, index) => {
        const plan = index === 0 ? planToday : planTomorrow;

        return (
          <div className="w-full max-w-screen-lg mt-6 space-y-6" key={day}>
            <h1 className="text-2xl font-bold mb-4 text-yellow-500">{day}</h1>

            {/* Mobile View */}
            <div className="block sm:hidden">
              <div className="w-full max-h-52 overflow-y-auto bg-gray-700 rounded-lg shadow-md p-2">
                {plan.length > 0 ? (
                  plan.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col mb-2 p-3 bg-gray-800 rounded-lg shadow-md"
                    >
                      <h3 className="font-bold text-yellow-500">Stunde {item.Stunde}</h3>
                      <p className="text-gray-300">{item.Text || "Keine Vertretung"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">Keine Vertretungen für {day.toLowerCase()}.</p>
                )}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block relative">
              <table
                className="table-auto border-collapse border border-gray-400 w-full text-center"
                role="table"
                aria-label={`Stundenplan für ${day.toLowerCase()}`}
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  <tr className="bg-yellow-500 text-black" tabIndex={tabIndexValue} role="row">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <th
                        key={index}
                        className="p-3 border border-gray-300"
                        role="columnheader"
                        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      >
                        Stunde {index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr role="row">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <td
                        key={index}
                        className="p-3 border border-gray-300"
                        tabIndex={tabIndexValue}
                        role="cell"
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        {plan.find((item) => item.Stunde === index + 1)?.Unterricht || "-"}
                      </td>
                      
                    ))}
                  </tr>
                  <tr role="row">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <td
                        key={index}
                        className="p-3 border border-gray-300"
                        tabIndex={tabIndexValue}
                        role="cell"
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        {plan.find((item) => item.Stunde === index + 1)?.Lehrer || "-"}
                      </td>
                      
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
