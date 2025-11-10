const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
const PORT = 8000;

const latitude = 50.84310553905255;
const longitude = 12.875960703035425;


app.use(cors());

const CACHE_FILE = path.join(__dirname, "cache.json");

// full api link
// https://api.open-meteo.com/v1/dwd-icon?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,apparent_temperature,rain,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,rain_sum,wind_speed_10m_max&&hourly=temperature_2m,rain,weather_code&forecast_days=3&timeformat=unixtime&timezone=Europe%2FBerlin
// full api link
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,apparent_temperature,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timeformat=unixtime


//#region [rgba(90,155,243,0.0)] WEATHER DATA
// Function to fetch current weather data from the online API

const fetchWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timeformat=unixtime`,
    )
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}



const isTimestampExpired = (timestamp, expirationTime) => {
  //Time in Minutes
  return Date.now() - timestamp >= expirationTime * 60 * 1000;
}

app.get("/cache/weather", async (req, res) => {
  try {
    let cache = {};
    if (fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE));
      if (cache.weather && cache.weather.timestamp && !isTimestampExpired(cache.weather.timestamp, 5)) {
        return res.json(cache.weather.data);
      } else {
        console.log("cache expired")
      }
    }
    let data = await fetchWeatherData();
    cache.weather = {
        timestamp: Date.now(),
        data
      }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

    res.json(data);

  } catch(error) {
    res.status(500).send("Failed to retrieve weather data");
  }
})
//#endregion


async function parseFoodHTML(html) {
  const $ = cheerio.load(html);
  const daysOfWeek = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  const data = [];
  $("div.speiseplan-lang .kw.slide:first").each((index, element) => {
    let i = 2;
    daysOfWeek.forEach((day) => {
      const meals = { menus: { menuName: [], alergenes: [] }, soup: { soupName: [], alergens: [] } };
      const date = $(element).find(`.col${i}.row1 span`).text().trim().replace(/\s\s+/g, " ");

      for (let j = 2; j <= 6; j++) {
        const meal = $(element).find(`.col${i}.row${j} p.gericht`).text().trim().replace(/\s\s+/g, " ");
        const menuParts = meal.split(RegExp(/, |,|\//));
        for(x = 0; x < menuParts.length; x++) {
          str = menuParts[x]
          if(str.includes("\n")) {
            menuParts[x] = str.slice(1)
            console.log(str)
            str = menuParts[x]
          }
          if(str == "Käse und Ei") {
            menuParts[0] = menuParts[0] + ', ' + menuParts[x]
          } else {
            if(str.length > 3) {
              if(x != 0) {
                menuParts[0] = menuParts[0] + ', ' + menuParts[x]
                menuParts[1] = ''
              }
            } else {
              str2 =menuParts[1]
              if(str2.length == 0 || menuParts[1] == menuParts[x]) {
                menuParts[1] = menuParts[x]
              } else {
                menuParts[1] = menuParts[1] + ',' + menuParts[x]
              }
            }
          }
        }
        if (menuParts.length > 1) {
          if (j === 2) {
            meals.soup.soupName.push(menuParts[0].trim());
            meals.soup.alergens.push(menuParts[1].trim());

          } else {
            meals.menus.menuName.push(menuParts[0].trim());
            meals.menus.alergenes.push(menuParts[1].trim());
          }
        }
      }
      data.push({ date, meals });
      i++;
    });
  });

  return data;
}

app.get("/cache/food", async (req, res) => {
  try {
    let cache = {};

    if (fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE));
      if (cache.food && cache.food.timestamp && !isTimestampExpired(cache.food.timestamp, 5)) {
        console.log("return cached food data");
        return res.json(cache.food.data);
      } else {
        console.log("cache expired");
      }
    }

    try {
      console.log("Fetching speiseplan data...");
      const response = await axios.get(
        `https://www.kantine-chemnitz.de/speiseplan.html`,
      );
      const data = await parseFoodHTML(response.data);

      const timestamp = Date.now();

      cache.food = {
        timestamp: Date.now(),
        data
      }

      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

      res.json(data);
    } catch (error) {
      console.error("Error fetching speiseplan data:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// FAHRPLAN
async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    throw error;
  }
}

function parseHTML(html) {
  const $ = cheerio.load(html);
  const data = [];

  
  console.log(data);
  
  
  
  
  
  
  

  $("div.std3_departure-line").each((index, element) => {
      const lineNr = $(element)
          .find(".std3_dm-mot-info a")
          .text()
          .trim()
          .replace(/[^0-9]/g, "")
          .substring(0, 2);

      if (lineNr !== "31") return;

      const desc = $(element)
          .find(".std3_dm-mot-info")
          .text()
          .trim()
          .replace("Stadtbus", "")
          .replace(/\d+/g, "");

      const time = $(element).find(".std3_dm-time:first").text().trim();
      const realtime = $(element).find(".std3_realtime-column").text().trim();
      
      const existingEntryIndex = data.findIndex(
          (entry) => entry.lineNr === lineNr && entry.desc === desc
      );

      if (existingEntryIndex !== -1) {
          if (!realtime) {
              data[existingEntryIndex].times.push({ time });
          } else {
              data[existingEntryIndex].times.push({ time, realtime });
          }
      } else {
          if (!realtime) {
              data.push({ lineNr, desc, times: [{ time }] });
          } else {
              data.push({ lineNr, desc, times: [{ time, realtime }] });
          }
      }
  });

  return data;
}


function formatBusData(parsedData) {
  const busData = {};
  parsedData.forEach((entry) => {
    const { lineNr, desc, times } = entry;
    const departureTimes = times.map((timeObj) => timeObj.time);
    const realTimes = times.map((timeObj) => timeObj.realtime);
    busData[lineNr.trim()] = { desc: desc.trim(), departureTimes, realTimes };
  });
  return busData;
}

const formatDate = (date) => date.toISOString().split('T')[0].split('-').reverse().join('.');
const formatTime = (date) => date.toTimeString().slice(0, 5).replace(':', '%3A');



app.get("/cache/busplan", async (req, res) => {
  const baseUrl = "https://efa.vvo-online.de/VMSSL3/XSLT_DM_REQUEST";
  const currentDate = new Date();
  const url = `${baseUrl}?language=de&std3_suggestMacro=std3_suggest&std3_commonMacro=dm&itdLPxx_contractor=&std3_contractorMacro=&includeCompleteStopSeq=1&mergeDep=1&mode=direct&useRealtime=1&name_dm=Chemnitz%2C+Flemmingstr&nameInfo_dm=36030194&type_dm=any&itdDateDayMonthYear=${formatDate(
    currentDate
  )}&itdTime=${formatTime(
    currentDate
  )}&itdDateTimeDepArr=dep&includedMeans=checkbox&itdLPxx_ptActive=on&useRealtime=1&inclMOT_0=true&inclMOT_1=true&inclMOT_2=true&inclMOT_3=true&inclMOT_4=true&inclMOT_5=true&inclMOT_6=true&inclMOT_7=true&inclMOT_8=true&inclMOT_9=true&inclMOT_10=true&inclMOT_17=true&inclMOT_19=true&imparedOptionsActive=1&sessionID=0&requestID=0&itdLPxx_directRequest=1&coordOutputFormat=WGS84[dd.ddddd]`;

  const infoURL = 'https://www.cvag.de/de/Verkehrsinformation_5791.html?typ=Bus&linie=31'

  try {
    let cache = {};
    if (fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE));
      if (cache.busData && cache.busData.timestamp && !isTimestampExpired(cache.busData.timestamp, 0.1)) {
        return res.json(cache.busData);
      } else {
        console.log("cache expired");
    }
    const bushtml = await fetchHTML(url);
    const timestamp = Date.now();
    const parsedData = parseHTML(bushtml);
    const busData = formatBusData(parsedData);

    cache.busData = { timestamp, busData };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    res.json(busData);
  }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//#endregion


// VERTRETUNGSPLAN
app.get("/cache/vertretungsplan", async (req, res) => {
  const baseUrl = "https://api.sfz-cowerk.de/"
  const url = `${baseUrl}vertretungsplan`;
  const url2 = `${baseUrl}vertretungsplan/?morgen`

  const specializations = {};

  try {
    let cache = {};
    if(fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE));
      if (cache.vertretungsplan && cache.vertretungsplan.timestamp && !isTimestampExpired(cache.vertretungsplan.timestamp, 60)) {
        return res.json(cache.vertretungsplan.data);
      } else {
      }
    }



    const response_tdy = await axios.get(url);
    const response_tmr = await axios.get(url2);
    for (let i = 1; i < response_tdy.data[1].length; i++) {
      specializations[response_tdy.data[1][i]] = {
        heute: [],
        morgen: []
      };
      //heute
      for (let j = 2; j < response_tdy.data.length; j++) {
        // Remove if the actual Plan is fixed and does not have 2 first rows
        if (j == 3) {
          continue;
        }
        // until here (bcs the api atm sends back 2 first rows lol)
        specializations[response_tdy.data[1][i]].heute.push(response_tdy.data[j][i]);
      }

      for (let j = 2; j < response_tmr.data.length; j++) {
        // Somehow the tmr plan has nothing to remove bcs it only sends back 1 first row
        specializations[response_tdy.data[1][i]].morgen.push(response_tmr.data[j][i]);
      }
    }

    const timestamp = Date.now();
    cache.vertretungsplan = { timestamp, data: specializations };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    res.json(specializations);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });