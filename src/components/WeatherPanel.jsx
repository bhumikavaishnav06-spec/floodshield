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
import { FloodShieldAPI } from '../lib/floodShieldApi'
import './WeatherPanel.css'


function WeatherPanel({ villageName = null }) {
  const [village, setVillage] = useState(null)
  const [extra, setExtra] = useState({ humidity: null, wind: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await FloodShieldAPI.getRiskData()

        if (res.status !== 'success' || !res.data?.length) {
          throw new Error('No village data returned from backend')
        }

        // Pick a specific village if given, otherwise auto-feature
        // the highest-risk village — great for a live demo.
        let target = res.data[0]

        if (villageName) {
          target =
            res.data.find(
              (v) => v.name.toLowerCase() === villageName.toLowerCase()
            ) || target
        } else {
          target = res.data.reduce((worst, v) =>
            v.risk_score > worst.risk_score ? v : worst
          )
        }

        setVillage(target)

        // Supplemental atmospheric data (humidity, wind) —
        // not tracked by backend, fetched directly for display only.
        try {
          const weatherRaw = await getWeatherData(target.lat, target.lon)
          setExtra({
            humidity: weatherRaw.current?.relative_humidity_2m ?? null,
            wind: weatherRaw.current?.wind_speed_10m ?? null,
          })
        } catch {
          setExtra({ humidity: null, wind: null })
        }

      } catch (err) {
        console.error(err)
        setError('Unable to load live flood intelligence data')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [villageName])


  if (loading) {
    return (
      <div className="weather-panel loading">
        <Activity size={17} />
        Loading FloodShield intelligence...
      </div>
    )
  }

  if (error || !village) {
    return (
      <div className="weather-panel error">
        {error || 'No data available'}
      </div>
    )
  }

  const { weather, breakdown, cloudburst, glof } = village

  return (
    <div className="weather-panel">

      {/* HEADER */}

      <div className="weather-header">

        <div>
          <span className="weather-label">
            LIVE FLOOD INTELLIGENCE
          </span>

          <h3>
            Regional Conditions — {village.name}
          </h3>
        </div>

        <div className="weather-live">
          <span></span>
          LIVE
        </div>

      </div>


      {/* RISK RESULT */}

      <div className="risk-result">

        <div className="risk-result-left">

          <div className="risk-result-icon">
            <ShieldAlert size={22} />
          </div>

          <div>
            <span>FLOOD RISK</span>

            <strong>
              {village.risk_level}
            </strong>
          </div>

        </div>

        <div className="risk-score">

          <strong>
            {village.risk_score}
          </strong>

          <span>/ 100</span>

        </div>

      </div>


      {/* WEATHER DATA */}

      <div className="weather-grid">

        <div className="weather-item">
          <div className="weather-icon temperature">
            <Thermometer size={18} />
          </div>
          <div>
            <span>Temperature</span>
            <strong>{weather.temp}°C</strong>
          </div>
        </div>

        <div className="weather-item">
          <div className="weather-icon rain">
            <CloudRain size={18} />
          </div>
          <div>
            <span>Rainfall (24h)</span>
            <strong>{weather.rain} mm</strong>
          </div>
        </div>

        <div className="weather-item">
          <div className="weather-icon humidity">
            <Droplets size={18} />
          </div>
          <div>
            <span>Humidity</span>
            <strong>{extra.humidity !== null ? `${extra.humidity}%` : 'N/A'}</strong>
          </div>
        </div>

        <div className="weather-item">
          <div className="weather-icon wind">
            <Wind size={18} />
          </div>
          <div>
            <span>Wind Speed</span>
            <strong>{extra.wind !== null ? `${extra.wind} km/h` : 'N/A'}</strong>
          </div>
        </div>

      </div>


      {/* RISK COMPONENTS — now multi-hazard */}

      <div className="risk-components">

        <div className="component-header">
          Multi-hazard risk breakdown
        </div>

        <div className="component-row">
          <span>Rainfall score</span>
          <strong>+{breakdown.rainfall}</strong>
        </div>

        <div className="component-row">
          <span>Soil saturation</span>
          <strong>+{breakdown.soil}</strong>
        </div>

        <div className="component-row">
          <span>Terrain slope</span>
          <strong>+{breakdown.slope}</strong>
        </div>

        <div className="component-row">
          <span>Elevation</span>
          <strong>{village.elev} m</strong>
        </div>

        <div className="component-row">
          <span>Cloudburst status</span>
          <strong>{cloudburst.level.replace(/_/g, ' ')}</strong>
        </div>

        <div className="component-row">
          <span>GLOF risk</span>
          <strong>
            {glof.applicable ? `${glof.risk_level} (${glof.lake_name})` : 'N/A'}
          </strong>
        </div>

      </div>


      {/* SOURCE */}

      <div className="data-source">
        <Activity size={13} />
        Live meteorological data → FloodShield Multi-Hazard Risk Engine
      </div>

    </div>
  )
}


export default WeatherPanel