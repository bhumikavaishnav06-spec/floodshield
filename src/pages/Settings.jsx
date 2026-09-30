import { useEffect, useState } from 'react'
import './Modules.css'

const BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

function Settings() {
  const authority = localStorage.getItem('floodshield_authority') || 'Unknown'
  const [backend, setBackend] = useState('Checking...')
  const [refreshMinutes, setRefreshMinutes] = useState(5)
  const [threshold, setThreshold] = useState(75)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedPrefs = localStorage.getItem('floodshield_settings')
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs)
      setRefreshMinutes(prefs.refreshMinutes ?? 5)
      setThreshold(prefs.alertThreshold ?? 75)
    }

    fetch(BASE)
      .then((r) => r.json())
      .then((d) => setBackend(d.message || d.status || 'Online'))
      .catch(() => setBackend('Offline — start the Python API on port 8000'))
  }, [])

  function savePrefs(e) {
    e.preventDefault()
    localStorage.setItem(
      'floodshield_settings',
      JSON.stringify({ refreshMinutes, alertThreshold: threshold })
    )
    setSaved(true)
  }

  return (
    <div className="module-page">

      <div className="module-header">
        <span>ADMINISTRATION</span>
        <h2>System Settings</h2>
        <p>Session, backend connection and local dashboard preferences.</p>
      </div>

      <div className="fs-grid">
        <div className="fs-panel fs-kpi">
          <span>AUTHORITY SESSION</span>
          <strong>{authority}</strong>
          <small>Stored in this browser</small>
        </div>
        <div className="fs-panel fs-kpi">
          <span>BACKEND</span>
          <strong style={{ fontSize: 16 }}>{backend}</strong>
          <small>{BASE}</small>
        </div>
      </div>

      <form className="fs-panel" onSubmit={savePrefs}>
        <div className="card-heading">
          <div>
            <span>LOCAL PREFERENCES</span>
            <h3>Dashboard preferences</h3>
          </div>
        </div>

        <label className="fs-note">
          Refresh interval (minutes)
          <input
            type="number"
            min="1"
            value={refreshMinutes}
            onChange={(e) => setRefreshMinutes(Number(e.target.value))}
            style={{ display: 'block', marginTop: 6, padding: 8, width: '100%', maxWidth: 280 }}
          />
        </label>

        <label className="fs-note">
          Critical alert threshold
          <input
            type="number"
            min="1"
            max="100"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ display: 'block', marginTop: 6, padding: 8, width: '100%', maxWidth: 280 }}
          />
        </label>

        <div className="fs-actions">
          <button className="view-alerts" type="submit">Save preferences</button>
        </div>
        {saved && <p className="fs-note">Saved on this device. Backend risk thresholds are still fixed in the Python risk engine.</p>}
      </form>
    </div>
  )
}

export default Settings