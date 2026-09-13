const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast'

export async function getWeatherData(latitude, longitude) {
  const url =
    `${WEATHER_API}?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m` +
    `&hourly=precipitation,rain,soil_moisture_0_to_7cm,temperature_2m,relative_humidity_2m` +
    `&forecast_days=2` +
    `&timezone=auto`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Weather data could not be loaded')
  }

  const data = await response.json()

  return data
}