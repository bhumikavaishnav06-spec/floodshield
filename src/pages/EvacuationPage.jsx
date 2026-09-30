import { useEffect, useState } from 'react'
import { AlertTriangle, Users } from 'lucide-react'
import { FloodShieldAPI } from '../lib/floodShieldApi'
import './ModulePages.css'

const FALLBACK = ['Chamoli', 'Joshimath', 'Badrinath', 'Kedarnath', 'Gopeshwar']

export default function EvacuationPage() {
  const [names, setNames] = useState(FALLBACK)
  const [selected, setSelected] = useState('Kedarnath')
  const [scope, setScope] = useState('at_risk')
  const [plan, setPlan] = useState(null)
  const [context, setContext] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    FloodShieldAPI.getRiskData().then((res) => {
      if (res.status === 'success' && res.data?.length) {
        setNames(res.data.map((v) => v.name))
        setContext(res.data.find((v) => v.name === selected) || null)
      }
    })
  }, [selected])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      const res = await FloodShieldAPI.getEvacuationPlan(selected, scope)
      if (cancelled) return
      if (res.status !== 'success') {
        setError(res.message || 'Could not build evacuation plan')
        setPlan(null)
      } else {
        setPlan(res.plan)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [selected, scope])

  return (
    <div className="module-page">
      <div className="module-header">
        <span>RESPONSE COORDINATION</span>
        <h2>Response & Evacuation</h2>
        <p>
          Priority groups, shelter allocation, and estimated movement time for the selected village.
        </p>
      </div>

      <div className="fs-module">
        <div className="fs-row">
          <div className="fs-tabs">
            {names.map((name) => (
              <button
                key={name}
                className={`fs-tab ${selected === name ? 'active' : ''}`}
                onClick={() => setSelected(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="fs-tabs">
            <button className={`fs-tab ${scope === 'at_risk' ? 'active' : ''}`} onClick={() => setScope('at_risk')}>
              People at risk
            </button>
            <button className={`fs-tab ${scope === 'full' ? 'active' : ''}`} onClick={() => setScope('full')}>
              Full population
            </button>
          </div>
        </div>

        {context && (
          <div className="fs-note">
            Current level: <b>{context.risk_level}</b> ({context.risk_score}/100).
            {context.glof?.applicable ? ` GLOF watch: ${context.glof.lake_name} — ${context.glof.risk_level}.` : ' No glacial lake linked to this village.'}
            {context.cloudburst ? ` Cloudburst: ${context.cloudburst.level.replaceAll('_', ' ')}.` : ''}
          </div>
        )}

        {loading && <div className="fs-note">Building evacuation plan for {selected}...</div>}
        {error && <div className="fs-note">{error}</div>}

        {plan && !loading && (
          <>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-icon orange"><Users size={19} /></div>
                <div>
                  <span>TO MOVE</span>
                  <strong>{plan.total_to_evacuate.toLocaleString()}</strong>
                  <small>{plan.scope === 'full' ? 'Full village plan' : 'Current exposure'}</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><AlertTriangle size={19} /></div>
                <div>
                  <span>RISK LEVEL</span>
                  <strong>{plan.risk_level}</strong>
                  <small>Score {plan.risk_score}/100</small>
                </div>
              </div>
            </div>

            <div className="stat-grid">
              {plan.priority_groups.map((g) => (
                <div className="stat-card" key={g.group}>
                  <div className="stat-icon cyan"><Users size={19} /></div>
                  <div>
                    <span>PRIORITY {g.priority}</span>
                    <strong>{g.count.toLocaleString()}</strong>
                    <small>{g.group}</small>
                  </div>
                </div>
              ))}
            </div>

            {plan.warning && (
              <div className="warning-banner">
                <div className="warning-icon"><AlertTriangle size={19} /></div>
                <div className="warning-content">
                  <strong>SHELTER CAPACITY GAP</strong>
                  <span>{plan.warning}</span>
                </div>
              </div>
            )}

            <div className="full-alerts-card">
              {plan.shelter_allocation.length === 0 && (
                <div className="alert-item">
                  <div className="alert-marker blue-marker">i</div>
                  <div>
                    <strong>No immediate movement required</strong>
                    <span>People-at-risk is currently zero. Switch to Full population to preview a complete plan.</span>
                  </div>
                  <small>STANDBY</small>
                </div>
              )}

              {plan.shelter_allocation.map((s, i) => (
                <div className={`alert-item ${s.alert_priority === 'IMMEDIATE' ? 'high-alert' : ''}`} key={`${s.shelter_name}-${i}`}>
                  <div className={`alert-marker ${s.alert_priority === 'URGENT' ? 'orange-marker' : s.alert_priority === 'STANDBY' ? 'blue-marker' : ''}`}>
                    {i + 1}
                  </div>
                  <div>
                    <strong>{s.shelter_name}</strong>
                    <span>
                      {s.distance_km} km · {s.allocated_population.toLocaleString()} people · about {s.estimated_time_hours} h
                    </span>
                  </div>
                  <small>{s.alert_priority}</small>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}