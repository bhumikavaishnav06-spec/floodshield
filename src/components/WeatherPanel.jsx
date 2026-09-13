import { useEffect, useState } from 'react'
import {
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Activity,
  ShieldAlert,
} from 'lucide-react'

import { getWeatherData } from '../data/weatherApi'
import { calculateFloodRisk } from '../data/riskEngine'
import {
  getTerrainData,
} from '../data/terrainData'
import './WeatherPanel.css'


function WeatherPanel() {
  const [weather, setWeather] = useState(null)
  const [risk, setRisk] = useState(null)
  const [terrain, setTerrain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadWeather() {
      try {
        // Initial test location: Dehradun
        const data = await getWeatherData(
          30.3165,
          78.0322
        )

        setWeather(data)

        // Current rainfall
        const rainfall = data.current.rain ?? 0

        // Get hourly rainfall
        const hourlyRain = data.hourly?.precipitation ?? []

        // Estimate recent rainfall intensity
        const recentRain = hourlyRain.slice(0, 3)

        const rainfallIntensity =
          recentRain.length > 0
            ? recentRain.reduce(
                (total, value) => total + value,
                0
              )
            : rainfall

        // Soil moisture
        const soilMoisture =
          data.hourly?.soil_moisture_0_to_7cm?.[0] ?? 0

        // Temporary terrain value.
        // Later this will come from real DEM/slope data.
       const terrain = getTerrainData('dehradun')
       setTerrain(terrain)

const slope = terrain.slope

        const riskResult = calculateFloodRisk({
          rainfall,
          rainfallIntensity,
          soilMoisture,
          slope,
        })

        setRisk(riskResult)

      } catch (err) {
        console.error(err)
        setError('Unable to load live weather data')
      } finally {
        setLoading(false)
      }
    }

    loadWeather()
  }, [])


  if (loading) {
    return (
      <div className="weather-panel loading">
        <Activity size={17} />
        Loading FloodShield intelligence...
      </div>
    )
  }


  if (error) {
    return (
      <div className="weather-panel error">
        {error}
      </div>
    )
  }


  const current = weather.current


  return (
    <div className="weather-panel">

      {/* HEADER */}

      <div className="weather-header">

        <div>
          <span className="weather-label">
            LIVE FLOOD INTELLIGENCE
          </span>

          <h3>
            Regional Conditions
          </h3>
        </div>

        <div className="weather-live">
          <span></span>
          LIVE
        </div>

      </div>


      {/* RISK RESULT */}

      {risk && (
        <div className="risk-result">

          <div className="risk-result-left">

            <div className="risk-result-icon">
              <ShieldAlert size={22} />
            </div>

            <div>
              <span>FLOOD RISK</span>

              <strong>
                {risk.level}
              </strong>
            </div>

          </div>

          <div className="risk-score">

            <strong>
              {risk.score}
            </strong>

            <span>/ 100</span>

          </div>

        </div>
      )}


      {/* WEATHER DATA */}

      <div className="weather-grid">

        {/* TEMPERATURE */}

        <div className="weather-item">

          <div className="weather-icon temperature">
            <Thermometer size={18} />
          </div>

          <div>
            <span>Temperature</span>

            <strong>
              {current.temperature_2m}°C
            </strong>
          </div>

        </div>


        {/* RAIN */}

        <div className="weather-item">

          <div className="weather-icon rain">
            <CloudRain size={18} />
          </div>

          <div>
            <span>Rainfall</span>

            <strong>
              {current.rain} mm
            </strong>
          </div>

        </div>


        {/* HUMIDITY */}

        <div className="weather-item">

          <div className="weather-icon humidity">
            <Droplets size={18} />
          </div>

          <div>
            <span>Humidity</span>

            <strong>
              {current.relative_humidity_2m}%
            </strong>
          </div>

        </div>


        {/* WIND */}

        <div className="weather-item">

          <div className="weather-icon wind">
            <Wind size={18} />
          </div>

          <div>
            <span>Wind Speed</span>

            <strong>
              {current.wind_speed_10m} km/h
            </strong>
          </div>

        </div>

      </div>


      {/* RISK COMPONENTS */}

      {risk && terrain && (
  <div className="risk-components">

    <div className="component-header">
      Risk calculation components
    </div>

    <div className="component-row">

      <span>Rainfall</span>

      <strong>
        +{risk.components.rainfallScore}
      </strong>

    </div>

    <div className="component-row">

      <span>Rainfall intensity</span>

      <strong>
        +{risk.components.intensityScore}
      </strong>

    </div>

    <div className="component-row">

      <span>Soil moisture</span>

      <strong>
        +{risk.components.soilScore}
      </strong>

    </div>

    <div className="component-row">

      <span>Terrain slope</span>

      <strong>
        {terrain.slope}°
      </strong>

    </div>

    <div className="component-row">

      <span>Elevation</span>

      <strong>
        {terrain.elevation} m
      </strong>

    </div>

    <div className="component-row">

      <span>Terrain type</span>

      <strong>
        {terrain.terrainType}
      </strong>

    </div>

  </div>
)}


      {/* SOURCE */}

      <div className="data-source">

        <Activity size={13} />

        Live meteorological data → FloodShield Risk Engine

      </div>

    </div>
  )
}


export default WeatherPanel