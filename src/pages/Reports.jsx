import { useState } from 'react'
import { Download, MessageSquare, Activity } from 'lucide-react'
import { FloodShieldAPI } from '../lib/floodShieldApi'
import './Modules.css'

const VILLAGES = ['Chamoli', 'Joshimath', 'Badrinath', 'Kedarnath', 'Gopeshwar']

function Reports() {
  const [sms, setSms] = useState([])
  const [smsLoading, setSmsLoading] = useState(false)
  const [trendVillage, setTrendVillage] = useState('Kedarnath')
  const [trend, setTrend] = useState(null)
  const [trendLoading, setTrendLoading] = useState(false)

  async function loadSms() {
    setSmsLoading(true)
    const res = await FloodShieldAPI.getSmsAlerts()
    setSms(res.messages || [])
    setSmsLoading(false)
  }

  async function loadTrend(name = trendVillage) {
    setTrendLoading(true)
    const res = await FloodShieldAPI.getPredictTrend(name)
    setTrend(res)
    setTrendLoading(false)
  }

  return (
    <div className="module-page">

      <div className="module-header">
        <span>OFFICIAL OUTPUT</span>
        <h2>Situation Reports</h2>
        <p>
          District PDF, risk chart, simulated SMS alerts and short-term trend estimate.
        </p>
      </div>

      <div className="fs-panel">
        <div className="card-heading">
          <div>
            <span>DISTRICT REPORT</span>
            <h3>Download current risk report</h3>
          </div>
          <Download size={18} />
        </div>
        <p className="fs-note">
          Generates a PDF from the live multi-hazard assessment. First download can take a few seconds.
        </p>
        <div className="fs-actions">
          <a className="view-alerts" href={FloodShieldAPI.reportDownloadUrl} target="_blank" rel="noreferrer">
            Download PDF report
          </a>
        </div>
      </div>

      <div className="fs-panel">
        <div className="card-heading">
          <div>
            <span>RISK COMPARISON</span>
            <h3>Village chart</h3>
          </div>
          <Activity size={18} />
        </div>
        <img
          src={FloodShieldAPI.chartUrl}
          alt="Village risk comparison chart"
          style={{ width: '100%', marginTop: 12, borderRadius: 12 }}
        />
      </div>

      <div className="fs-panel">
        <div className="card-heading">
          <div>
            <span>ALERT SIMULATION</span>
            <h3>SMS that would be sent</h3>
          </div>
          <MessageSquare size={18} />
        </div>
        <p className="fs-note">
          Simulation only. No real SMS is sent and no Twilio credit is used.
        </p>
        <div className="fs-actions">
          <button className="view-alerts" onClick={loadSms} disabled={smsLoading}>
            {smsLoading ? 'Generating...' : 'Generate SMS alerts'}
          </button>
        </div>

        <div className="full-alerts-card">
          {sms.map((m) => (
            <div key={`${m.village}-${m.timestamp}`} className={`alert-item ${m.risk_level === 'CRITICAL' ? 'high-alert' : ''}`}>
              <div className={`alert-marker ${m.risk_level === 'CRITICAL' ? '' : 'orange-marker'}`}>!</div>
              <div>
                <strong>{m.village} · {m.risk_level}</strong>
                <span>{m.recipients_simulated.toLocaleString()} simulated recipients · {m.status}</span>
                <pre className="fs-pre">{m.message}</pre>
              </div>
            </div>
          ))}
          {!smsLoading && sms.length === 0 && (
            <p className="fs-note">No preview yet. Generate alerts to see CRITICAL and WARNING messages.</p>
          )}
        </div>
      </div>

      <div className="fs-panel">
        <div className="card-heading">
          <div>
            <span>TREND ESTIMATE</span>
            <h3>Risk direction</h3>
          </div>
        </div>
        <div className="fs-row">
          {VILLAGES.map((name) => (
            <button
              key={name}
              className={`fs-chip ${trendVillage === name ? 'active' : ''}`}
              onClick={() => {
                setTrendVillage(name)
                loadTrend(name)
              }}
            >
              {name}
            </button>
          ))}
        </div>
        {trendLoading && <p className="fs-note">Calculating trend...</p>}
        {trend && trend.status !== 'ok' && (
          <p className="fs-note">{trend.message || 'Not enough history yet. Keep the backend running and refresh the dashboard a few times.'}</p>
        )}
        {trend && trend.status === 'ok' && (
          <div className="fs-grid">
            <div className="fs-kpi"><span>DIRECTION</span><strong>{trend.trend_direction}</strong></div>
            <div className="fs-kpi"><span>PER HOUR</span><strong>{trend.rate_per_hour}</strong></div>
            <div className="fs-kpi"><span>+1 HOUR</span><strong>{trend.forecast.next_1hr}</strong></div>
            <div className="fs-kpi"><span>+6 HOURS</span><strong>{trend.forecast.next_6hr}</strong></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports