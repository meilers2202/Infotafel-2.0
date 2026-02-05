"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme, Typography, Box, SvgIcon, Divider } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

// Theme außerhalb der Komponente definieren, um Re-Renders zu vermeiden
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Fahrplan({ isActive }) {
  const [busplanData, setBusplanData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // NEXT_PUBLIC_ ist wichtig! dotenv import wurde entfernt.
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_APP_API_URL || "http://localhost:1337/api/";
        const response = await axios.get(`${baseUrl}cache/busplan`);
        if (response.data && response.data.busData) {
          setBusplanData(response.data.busData);
        }
      } catch (error) {
        console.error("Fahrplan Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!busplanData) return;

      const currentTime = new Date().getTime();
      const updatedBusplanData = { ...busplanData };
      let changed = false;

      for (const bus in updatedBusplanData) {
        if (updatedBusplanData[bus].departureTimes?.length) {
          const departureTime = new Date(updatedBusplanData[bus].departureTimes[0]).getTime();
          if (departureTime < currentTime) {
            updatedBusplanData[bus].departureTimes.shift();
            changed = true;
          }
        }
      }
      if (changed) setBusplanData(updatedBusplanData);
    }, 60000);

    return () => clearInterval(timer);
  }, [busplanData]);

  const renderTimeStatus = (stationName, busLine, plannedTime, realTime, index) => {
    const isDelayed = plannedTime !== realTime;
    return (
      <Box
        key={index}
        className="w-full mb-3 px-3 py-3 bg-gray-800/80 rounded-xl border border-white/5 shadow-lg"
        sx={{ maxWidth: "600px", mx: "auto" }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
          <Typography
            className="text-white font-bold flex items-center"
            sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}
          >
            <DirectionsBusIcon sx={{ mr: 1, color: "#3498db", fontSize: "1.2rem" }} />
            {stationName} <span className="text-blue-400 ml-2">Linie {busLine}</span>
          </Typography>
          <Divider sx={{ width: "50%", my: 1, borderColor: "rgba(255,255,255,0.1)" }} />
        </Box>

        <Box display="flex" justifyContent="space-around" alignItems="center">
          <Box textAlign="center">
            <Typography className="text-gray-400 uppercase tracking-tighter" sx={{ fontSize: "0.65rem" }}>Geplant</Typography>
            <Typography className="text-white font-medium" sx={{ fontSize: "1.1rem" }}>{plannedTime}</Typography>
          </Box>

          <Box>
            {isDelayed ? <ErrorIcon color="error" /> : <CheckCircleIcon color="success" />}
          </Box>

          <Box textAlign="center">
            <Typography className="text-gray-400 uppercase tracking-tighter" sx={{ fontSize: "0.65rem" }}>Echtzeit</Typography>
            <Typography className={isDelayed ? "text-red-500 font-bold" : "text-green-500 font-bold"} sx={{ fontSize: "1.1rem" }}>
              {realTime}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <div 
      className="flex flex-col w-full h-screen overflow-y-auto pt-4 pb-32 custom-scrollbar-v"
      style={{ scrollBehavior: 'smooth' }}
    >
      <ThemeProvider theme={darkTheme}>
        <div className="w-full px-4">
          {loading ? (
            <div className="flex justify-center mt-20 text-gray-400 animate-pulse">Busdaten werden geladen...</div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <Box className="w-full" sx={{ maxWidth: "1200px" }}>
                {busplanData && busplanData["31"]?.departureTimes?.length > 0 ? (
                  busplanData["31"].departureTimes.slice(0, 8).map((time, index) => {
                    const realTime = busplanData["31"]?.realTimes?.[index] || time;
                    return renderTimeStatus("Flemmingstraße", "31", time, realTime, index);
                  })
                ) : (
                  <Typography className="text-center text-gray-500 mt-10">Keine aktuellen Abfahrten</Typography>
                )}
              </Box>

              <Typography className="text-gray-500 text-center mt-6 mb-10 text-[10px] max-w-[300px]">
                Angaben ohne Gewähr. Echtzeitdaten können abweichen.
              </Typography>
            </div>
          )}
        </div>
      </ThemeProvider>

      <style jsx>{`
        .custom-scrollbar-v::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-v::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default Fahrplan;