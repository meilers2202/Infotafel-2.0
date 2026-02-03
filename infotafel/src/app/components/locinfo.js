import axios from "axios";
import { useEffect, useState } from "react";

export default function LocInfo({ isActive }) {
  const [locInfo, setLocInfo] = useState([]);

  // Accessibility settings
  const tabIndexValue = isActive ? 0 : -1; // Only focusable when active
  const ariaHiddenValue = !isActive; // Hide from screen readers when inactive


  //get backend info from strappi API
  useEffect(() => {
    const fetchData = async () => {
          try {
      const response = await axios.get(`http://localhost:1337/api/betreuers?`)
      setLocInfo(response.data.data)

      } catch (e) {
        console.log('The API request failed')
      }
    }
    fetchData()
  }, [])

  // Extract repeated block as a reusable component

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-28 min-h-full items-center"
      aria-hidden={ariaHiddenValue}
    >
      {locInfo.map((data, index) => (
        <div 
          key={index} 
          className="flex flex-col w-full items-center text-center space-y-2 transform transition-transform hover:scale-125"
        >
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{data.WG}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="Betreuer Icon" className="w-6 h-6" />
            <h2 className="text-lg font-medium text-gray-300">{data.Betreuer}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" alt="Telefon Icon" className="w-6 h-6" />
            <h2 className="text-md text-gray-400">{data.Telefon}</h2>
          </div>
        </div>
      ))}
    </div>
  );
  
  
  
  
  
}
