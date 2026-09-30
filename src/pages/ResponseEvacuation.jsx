import { useEffect, useState } from 'react'
import { MapPin, Clock, Users } from 'lucide-react'
import { FloodShieldAPI } from '../lib/floodShieldApi'
import './Modules.css'

const FALLBACK = ['Chamoli', 'Joshimath', 'Badrinath', 'Kedarnath', 'Gopeshwar']

function ResponseEvacuation() {
  const [villages, setVillages] = useState([])
  const [selected, setSelected] = useState('Kedarnath')
  const [plan, setPlan] = useState(null)
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    FloodShieldAPI.getShelters().then((res) => {
      if (res.status === 'success') setShelters(res.data || [])
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')

      const [riskRes, planRes] = await Promise.all([
        FloodShieldAPI.getRiskData(),
        FloodShieldAPI.getEvacuationPlan(selected),
      ])

      if (cancelled) return

      if (riskRes.status === 'success') setVillages(riskRes.data || [])

      if (planRes.status === 'success') setPlan(planRes.plan)
      else setError(planRes.message || 'Could not load evacuation plan')

      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [selected])

  const current = villages.find((v) => v.name === selected)
  const names = villages.length ? villages.map((v) => v.name) : FALLBACK

  return (
    <div className="module-page">

      <div className="module-header">
        <span>RESPONSE COORDINATION</span>
        <h2>Response &amp; Evacuation</h2>
        <p>
          Priority groups, shelter allocation and estimated evacuation time
          for the selected village.
        </p>
      </div>

      <div className="fs-row">
        {names.map((name) => (
          <button
            key={name}
            className={`fs-chip ${selected === name ? 'active' : ''}`}
            onClick={() => setSelected(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {loading && <p className="fs-note">Generating evacuation plan for {selected}...</p>}
      {error && <p className="fs-note">{error}</p>}

      {!loading && plan && (
        <>
          <div className="fs-grid">
            <div className="fs-panel fs-kpi">
              <span>RISK LEVEL</span>
              <strong>{current?.risk_level || '—'}</strong>
              <small>Score {current?.risk_score ?? '—'}/100</small>
            </div>
            <div className="fs-panel fs-kpi">
              <span>TO EVACUATE NOW</span>
              <strong>{plan.total_to_evacuate.toLocaleString()}</strong>
              <small>Based on current risk level</small>
            </div>
            <div className="fs-panel fs-kpi">
              <span>SHELTERS USED</span>
              <strong>{plan.shelter_allocation.length}</strong>
              <small>Nearest available first</small>
            </div>
            <div className="fs-panel fs-kpi">
              <span>UNACCOMMODATED</span>
              <strong>{plan.warning ? 'YES' : 'NO'}</strong>
              <small>{plan.warning ? 'Extra capacity needed' : 'Capacity sufficient'}</small>
            </div>
          </div>

          <div className="fs-panel">
            <div className="card-heading">
              <div>
                <span>POPULATION MANAGEMENT</span>
                <h3>Priority evacuation groups</h3>
              </div>
              <Users size={18} />
            </div>

            <div className="fs-grid">
              {plan.priority_groups.map((g) => (
                <div key={g.group} className="fs-kpi">
                  <span>PRIORITY {g.priority}</span>
                  <strong>{g.count.toLocaleString()}</strong>
                  <small>{g.group}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="full-alerts-card">
            {plan.shelter_allocation.length === 0 && (
              <div className="alert-item">
                <div className="alert-marker blue-marker">i</div>
                <div>
                  <strong>No immediate evacuation required</strong>
                  <span>
                    Current risk does not put people in the evacuation band.
                    Shelter network is still listed below.
                  </span>
                </div>
                <small>STANDBY</small>
              </div>
            )}

            {plan.shelter_allocation.map((s, i) => (
              <div
                key={`${s.shelter_name}-${i}`}
                className={`alert-item ${s.alert_priority === 'IMMEDIATE' ? 'high-alert' : ''}`}
              >
                <div className={`alert-marker ${s.alert_priority === 'IMMEDIATE' ? '' : 'orange-marker'}`}>
                  <MapPin size={13} />
                </div>
                <div>
                  <strong>{s.shelter_name}</strong>
                  <span>
                    {s.allocated_population.toLocaleString()} people · {s.distance_km} km ·{' '}
                    <Clock size={12} /> {s.estimated_time_hours}h
                  </span>
                </div>
                <small>{s.alert_priority}</small>
              </div>
            ))}
          </div>

          {plan.warning && (
            <div className="warning-banner">
              <div className="warning-icon">!</div>
              <div className="warning-content">
                <strong>CAPACITY SHORTFALL</strong>
                <span>{plan.warning}</span>
              </div>
            </div>
          )}

          <div className="fs-panel">
            <div className="card-heading">
              <div>
                <span>SHELTER NETWORK</span>
                <h3>Registered shelters</h3>
              </div>
            </div>
            <div className="fs-table-wrap">
              <table className="fs-table">
                <thead>
                  <tr>
                    <th>Shelter</th>
                    <th>Capacity</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {shelters.map((s) => (
                    <tr key={s.name}>
                      <td>{s.name}</td>
                      <td>{s.cap?.toLocaleString()}</td>
                      <td>{s.lat}</td>
                      <td>{s.lon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ResponseEvacuation