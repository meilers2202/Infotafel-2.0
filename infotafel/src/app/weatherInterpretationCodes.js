// src/app/weatherInterpretationCodes.js

// Hilfsfunktionen für den dynamischen Import (werden in der Komponente genutzt)
export async function importAnimatedIcon(iconName) {
  const module = await import(`./weather/newWeatherIconsAnimated/${iconName}.json`);
  return module.default;
}

export async function importStaticIcon(iconName) {
  const module = await import(`./weather/staticLogos/${iconName}.svg`);
  return module.default;
}

const weatherInterpretationCodes = {
  0: {
    day: { desc: "Sonnig", animated: 'clear-day', static: "sun" },
    night: { desc: "Klarer Himmel", animated: 'clear-night', static: "sun" }
  },
  1: {
    day: { desc: "Hauptsächlich Sonnig", animated: 'haze-day', static: "partly-cloudy" },
    night: { desc: "Hauptsächlich klar", animated: 'haze-night', static: "partly-cloudy" }
  },
  2: {
    day: { desc: "Teilweise bewölkt", animated: 'partly-cloudy-day', static: "partly-cloudy" },
    night: { desc: "Teilweise bewölkt", animated: 'partly-cloudy-night', static: "partly-cloudy" }
  },
  3: {
    day: { desc: "Bedeckt", animated: 'cloudy', static: "cloud" },
    night: { desc: "Bedeckt", animated: 'cloudy', static: "cloud" }
  },
  45: {
    day: { desc: "Nebel", animated: 'fog-day', static: "cloud" },
    night: { desc: "Nebel", animated: 'fog-night', static: "cloud" }
  },
  48: {
    day: { desc: "Rauhreif-Nebel", animated: 'fog-day', static: "cloud" },
    night: { desc: "Rauhreif-Nebel", animated: 'fog-night', static: "cloud" }
  },
  51: {
    day: { desc: "Leichter Nieselregen", animated: 'overcast-day-drizzle', static: "light-rain" },
    night: { desc: "Leichter Nieselregen", animated: 'overcast-night-drizzle', static: "light-rain" }
  },
  53: {
    day: { desc: "Mäßiger Nieselregen", animated: 'overcast-day-hail', static: "rain" },
    night: { desc: "Mäßiger Nieselregen", animated: 'overcast-night-hail', static: "rain" }
  },
  55: {
    day: { desc: "Starker Nieselregen", animated: 'overcast-day-rain', static: "torrential-rain" },
    night: { desc: "Starker Nieselregen", animated: 'overcast-night-rain', static: "torrential-rain" }
  },
  56: {
    day: { desc: "Leichter Gefrierender Nieselregen", animated: 'overcast-day-drizzle', static: "rain" },
    night: { desc: "Leichter Gefrierender Nieselregen", animated: 'overcast-night-drizzle', static: "rain" }
  },
  57: {
    day: { desc: "Starker Gefrierender Nieselregen", animated: 'overcast-day-rain', static: "rain" },
    night: { desc: "Starker Gefrierender Nieselregen", animated: 'overcast-night-rain', static: "rain" }
  },
  61: {
    day: { desc: "Leichter Regen", animated: 'overcast-day-rain', static: "rain" },
    night: { desc: "Leichter Regen", animated: 'overcast-night-rain', static: "rain" }
  },
  63: {
    day: { desc: "Mäßiger Regen", animated: 'overcast-day-rain', static: "rain" },
    night: { desc: "Mäßiger Regen", animated: 'overcast-night-rain', static: "rain" }
  },
  65: {
    day: { desc: "Starker Regen", animated: 'overcast-day-rain', static: "storm" },
    night: { desc: "Starker Regen", animated: 'overcast-night-rain', static: "storm" }
  },
  66: {
    day: { desc: "Leichter Gefrierender Regen", animated: 'overcast-day-sleet', static: "rain" },
    night: { desc: "Leichter Gefrierender Regen", animated: 'overcast-night-sleet', static: "rain" }
  },
  67: {
    day: { desc: "Starker Gefrierender Regen", animated: 'overcast-day-sleet', static: "rain" },
    night: { desc: "Starker Gefrierender Regen", animated: 'overcast-night-sleet', static: "rain" }
  },
  71: {
    day: { desc: "Leichter Schneefall", animated: 'overcast-day-snow', static: "light-snow" },
    night: { desc: "Leichter Schneefall", animated: 'overcast-night-snow', static: "light-snow" }
  },
  73: {
    day: { desc: "Mäßiger Schneefall", animated: 'overcast-day-snow', static: "light-snow" },
    night: { desc: "Mäßiger Schneefall", animated: 'overcast-night-snow', static: "light-snow" }
  },
  75: {
    day: { desc: "Starker Schneefall", animated: 'overcast-day-snow', static: "snow-storm" },
    night: { desc: "Starker Schneefall", animated: 'overcast-night-snow', static: "snow-storm" }
  },
  77: {
    day: { desc: "Schneekörner", animated: 'overcast-day-snow', static: "light-snow" },
    night: { desc: "Schneekörner", animated: 'overcast-night-snow', static: "light-snow" }
  },
  80: {
    day: { desc: "Leichte Regenschauer", animated: 'overcast-day-drizzle', static: "light-rain" },
    night: { desc: "Leichte Regenschauer", animated: 'overcast-night-drizzle', static: "light-rain" }
  },
  81: {
    day: { desc: "Mäßige Regenschauer", animated: 'overcast-day-rain', static: "rain" },
    night: { desc: "Mäßige Regenschauer", animated: 'overcast-night-rain', static: "rain" }
  },
  82: {
    day: { desc: "Heftige Regenschauer", animated: 'overcast-day-rain', static: "rain" },
    night: { desc: "Heftige Regenschauer", animated: 'overcast-night-rain', static: "rain" }
  },
  85: {
    day: { desc: "Leichte Schneeschauer", animated: 'overcast-day-snow', static: "light-snow" },
    night: { desc: "Leichte Schneeschauer", animated: 'overcast-night-snow', static: "light-snow" }
  },
  86: {
    day: { desc: "Starker Schneeschauer", animated: 'overcast-day-snow', static: "snow-storm" },
    night: { desc: "Starker Schneeschauer", animated: 'overcast-night-snow', static: "snow-storm" }
  },
  95: {
    day: { desc: "Leichtes Gewitter", animated: 'thunderstorms-day-overcast', static: "cloud-lightning" },
    night: { desc: "Leichtes Gewitter", animated: 'thunderstorms-night-overcast', static: "cloud-lightning" }
  },
  96: {
    day: { desc: "Gewitter mit leichtem Hagel", animated: 'thunderstorms-day-rain', static: "cloud-lightning" },
    night: { desc: "Gewitter mit leichtem Hagel", animated: 'thunderstorms-night-rain', static: "cloud-lightning" }
  },
  99: {
    day: { desc: "Gewitter mit schwerem Hagel", animated: 'thunderstorms-day-extreme-rain', static: "cloud-lightning" },
    night: { desc: "Gewitter mit schwerem Hagel", animated: 'thunderstorms-night-extreme-rain', static: "cloud-lightning" }
  }
};

export default weatherInterpretationCodes;