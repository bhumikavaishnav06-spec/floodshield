import { useEffect, useState } from 'react'
import { FloodShieldAPI } from '../lib/floodShieldApi'
import './Modules.css'

const FALLBACK = ['Chamoli', 'Joshimath', 'Badrinath', 'Kedarnath', 'Gopeshwar']

function HistoricalEvents() {
  const [selected, setSelected] = useState('All')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const res = selected === 'All'
        ? await FloodShieldAPI.getAlertLog(50)
        : await FloodShieldAPI.getHistory(selected, 50)

      if (cancelled) return
      setRows(res.history || res.alerts || [])
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [selected])

  return (
    <div className="module-page">

      <div className="module-header">
        <span>SITUATION ARCHIVE</span>
        <h2>Historical Events</h2>
        <p>
          All shows recent CRITICAL and WARNING events. A village filter shows
          every saved reading for that village.
        </p>
      </div>

      <div className="fs-row">
        {['All', ...FALLBACK].map((name) => (
          <button
            key={name}
            className={`fs-chip ${selected === name ? 'active' : ''}`}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="fs-panel">
        <p className="fs-note">
          {loading ? 'Loading records...' : `${rows.length} records`}
        </p>

        <div className="fs-table-wrap">
          <table className="fs-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Village</th>
                <th>Score</th>
                <th>Level</th>
                <th>Cloudburst</th>
                <th>GLOF</th>
                <th>People at risk</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.id}>
                  <td>{h.timestamp ? new Date(h.timestamp).toLocaleString() : '—'}</td>
                  <td>{h.village}</td>
                  <td>{h.risk_score}</td>
                  <td>{h.risk_level}</td>
                  <td>{h.cloudburst_level || '—'}</td>
                  <td>{h.glof_level || '—'}</td>
                  <td>{h.people_at_risk?.toLocaleString?.() ?? h.people_at_risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && rows.length === 0 && (
          <p className="fs-note">
            No records yet. Open the dashboard once so the backend can save a reading, then refresh this page.
          </p>
        )}
      </div>
    </div>
  )
}

export default HistoricalEvents