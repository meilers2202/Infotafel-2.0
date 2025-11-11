import axios from "axios";
import { useEffect, useState } from "react";

export default function LocInfo({ isActive }) {
  const [genInfo, setLocInfo] = useState([]);

  // Accessibility settings
  const tabIndexValue = isActive ? 0 : -1; // Only focusable when active
  const ariaHiddenValue = !isActive; // Hide from screen readers when inactive

  // Get backend info from Strapi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/geninfos`
        );
        setLocInfo(response.data.data);
      } catch (e) {
        console.log("The API request failed");
      }
    };
    fetchData();
  }, []);

  return (
    <div aria-hidden={ariaHiddenValue}>
      <div
        className={`mt-20 grid grid-cols-1 md:grid-cols-2 gap-28 items-center ${
          isActive ? '' : 'pointer-events-none'
        }`}
      >
        {genInfo.map((data, index) => (
          <div
            key={index}
            className="flex flex-col w-full items-center text-center space-y-2 transform transition-transform hover:scale-125"
            tabIndex={tabIndexValue}
          >
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white tracking-tight" tabIndex={tabIndexValue}>
                {data.Personal}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-medium text-gray-300" tabIndex={tabIndexValue}>
                {data.Email}
              </h2>
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-20 flex-col items-center" tabIndex={tabIndexValue}>
        <h3 className="text-2xl font-semibold text-white mb-4 text-center">
          alternativ bei fragen im Haus 01 melden
        </h3>
        <button
          className="mt-20 px-10 py-4 bg-yellow-500 text-black rounded-full hover:bg-white focus:ring-2 focus:ring-blue-300"
          tabIndex={tabIndexValue}
        >
          <a
            className="font-bold text-xl"
            href="/ticket"
            rel="noopener noreferrer"
            tabIndex={tabIndexValue}
          >
            Ticket System Informatik
          </a>
        </button>
      </div>
    </div>
  );
}
