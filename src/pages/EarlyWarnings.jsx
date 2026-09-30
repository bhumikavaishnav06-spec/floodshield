import { useEffect, useState } from 'react'
import { Bell, Mountain, Activity } from 'lucide-react'
import { FloodShieldAPI } from '../lib/floodShieldApi'


function EarlyWarnings() {
  const [villages, setVillages] = useState([])
  const [cloudburstAlerts, setCloudburstAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [riskRes, cbRes] = await Promise.all([
        FloodShieldAPI.getRiskData(),
        FloodShieldAPI.getCloudburstMonitor(),
      ])
      if (riskRes.status === 'success') setVillages(riskRes.data)
      if (cbRes.status === 'success') setCloudburstAlerts(cbRes.alerts)
      setLoading(false)
    }
    load()
  }, [])

  const glofVillages = villages.filter(
    (v) => v.glof.applicable && v.glof.risk_level !== 'LOW'
  )

  if (loading) {
    return (
      <div className="module-page">
        <div className="module-header">
          <span>EMERGENCY MONITORING</span>
          <h2>Early Warnings</h2>
          <p>Loading live hazard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="module-page">

      <div className="module-header">
        <span>EMERGENCY MONITORING</span>
        <h2>Early Warnings</h2>
        <p>
          Monitor active cloudburst and glacial lake outburst flood (GLOF)
          conditions requiring authority attention.
        </p>
      </div>


      {/* CLOUDBURST SECTION */}

      <div className="full-alerts-card">

        {cloudburstAlerts.length === 0 && (
          <div className="alert-item">
            <div className="alert-marker blue-marker">i</div>
            <div>
              <strong>No active cloudburst alerts</strong>
              <span>All monitored regions currently normal</span>
            </div>
            <small>LIVE</small>
          </div>
        )}

        {cloudburstAlerts.map((a) => (
          <div
            key={a.village}
            className={`alert-item ${
              a.level === 'CLOUDBURST_IMMINENT' ? 'high-alert' : ''
            }`}
          >
            <div
              className={`alert-marker ${
                a.level === 'CLOUDBURST_IMMINENT' ? '' : 'orange-marker'
              }`}
            >
              !
            </div>
            <div>
              <strong>{a.level.replace(/_/g, ' ')}</strong>
              <span>
                {a.village} — current {a.current_rate_mm_hr}mm/hr,
                peak forecast {a.max_forecast_6hr_mm_hr}mm/hr
              </span>
            </div>
            <small>ACTIVE</small>
          </div>
        ))}

      </div>


      {/* GLOF SECTION */}

      {glofVillages.length > 0 && (
        <>
          <div className="module-header" style={{ marginTop: '2rem' }}>
            <span>GLACIAL HAZARD MONITORING</span>
            <h2>GLOF Risk — Glacial Lake Outburst Floods</h2>
            <p>
              Villages near glacial lakes, monitored using seismic activity
              and temperature anomaly data.
            </p>
          </div>

          <div className="full-alerts-card">
            {glofVillages.map((v) => (
              <div
                key={v.name}
                className={`alert-item ${
                  v.glof.risk_level === 'CRITICAL' ? 'high-alert' : ''
                }`}
              >
                <div
                  className={`alert-marker ${
                    v.glof.risk_level === 'CRITICAL' ? '' : 'orange-marker'
                  }`}
                >
                  <Mountain size={13} />
                </div>
                <div>
                  <strong>{v.name} — {v.glof.lake_name}</strong>
                  <span>
                    Seismic (7d): {v.glof.seismic_activity?.count_7days || 0} events,
                    max M{v.glof.seismic_activity?.max_magnitude || 0} |
                    Temp anomaly: {v.glof.temperature_anomaly?.anomaly || 0}°C
                  </span>
                </div>
                <small>{v.glof.risk_level}</small>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}

export default EarlyWarnings