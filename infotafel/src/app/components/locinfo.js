import { useEffect, useState } from "react";
import axios from "axios";

export default function LocInfo({ isActive }) {
  const [betreuer, setBetreuer] = useState([]);
  const [standort, setStandort] = useState([]);
  const [arzt, setArzt] = useState([]);

  // Accessibility settings
  const tabIndexValue = isActive ? 0 : -1; // Only focusable when active
  const ariaHiddenValue = !isActive; // Hide from screen readers when inactive


  //get backend info from strappi API
  useEffect(() => {
    const fetchData = async () => {
          try {
      const responseBetreuer = await axios.get(`http://localhost:1337/api/betreuer`)
      setBetreuer(responseBetreuer.data.data)

      const responseStandort = await axios.get(`http://localhost:1337/api/standorte`)
      setStandort(responseStandort.data.data)

      const responseArzt = await axios.get(`http://localhost:1337/api/aerzte`)
      setArzt(responseArzt.data.data)
          
      } catch (e) {
        console.log('The API request failed')
      }
    }
    fetchData()
  }, [])

  // Extract repeated block as a reusable component

  return (
    <div>
      <div aria-hidden={ariaHiddenValue} className="grid grid-cols-1 md:grid-cols-4 gap-28 min-h-full">
        {standort.map((ort, index) => (
          <div
            key={index}
            className="flex flex-col w-full items-center text-center space-y-2"
          >
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{ort.Art}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{ort.Standort}</h2>
            </div>
            <div aria-hidden={ariaHiddenValue}>
          </div>
            {betreuer.map((data, index2) => (
              <div 
                key={index2} 
                className="flex flex-col w-full items-center text-center space-y-2"
              >
                {data.Standort === ort.Standort ?
                  <div>
                    <div className="flex items-center space-x-3">
                      <img src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="Betreuer Icon" className="w-6 h-6" />
                      <h2 className="text-lg font-medium text-gray-300">{data.Betreuer}</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" alt="Telefon Icon" className="w-6 h-6" />
                      <h2 className="text-md font-medium text-gray-300">{data.Telefon}</h2>
                    </div>
                  </div>
                  :<div></div>
                }
              </div>
            ))}
            <br/>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">Notfallärztliche Vertretung</h1>
            </div>
            <div aria-hidden={ariaHiddenValue}>
              {arzt.map((arzt, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full items-center text-center space-y-2"
                >
                  {arzt.Standort === ort.Standort ?
                    <div>
                      <div className="flex items-center space-x-3">
                        <img src="https://img.icons8.com/ios-filled/50/ffffff/user.png" alt="Betreuer Icon" className="w-6 h-6" />
                        <h2 className="text-md font-medium text-gray-300">{arzt.Titel}{arzt.Name}</h2>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="https://img.icons8.com/ios-filled/50/ffffff/phone.png" alt="Telefon Icon" className="w-6 h-6" />
                        <h2 className="text-md font-medium text-gray-300">{arzt.Telefon}</h2>
                      </div>                    
                    </div>
                    :<div></div>
                  }
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  
  
  
  
}