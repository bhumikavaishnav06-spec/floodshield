import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  MapPin,
  Radio,
  ShieldAlert,
  Users,
  XCircle,
} from 'lucide-react'

import { useState } from 'react'
import './EarlyWarnings.css'

function EarlyWarnings() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'CRITICAL',
      title: 'Flash Flood Risk Detected',
      location: 'Dhanaulti Block',
      district: 'Tehri Garhwal',
      risk: 87,
      rainfall: '92 mm / 3 hrs',
      detected: '08 min ago',
      action: 'Prepare immediate evacuation of low-lying settlements.',
      status: 'ACTIVE',
    },
    {
      id: 2,
      severity: 'WARNING',
      title: 'Heavy Rainfall Expected',
      location: 'Mussoorie Region',
      district: 'Dehradun',
      risk: 68,
      rainfall: '64 mm / 3 hrs',
      detected: '21 min ago',
      action: 'Place response teams on standby and monitor drainage channels.',
      status: 'ACTIVE',
    },
    {
      id: 3,
      severity: 'WARNING',
      title: 'Slope Instability Risk',
      location: 'Chakrata Block',
      district: 'Dehradun',
      risk: 61,
      rainfall: '48 mm / 3 hrs',
      detected: '36 min ago',
      action: 'Restrict movement near identified vulnerable slopes.',
      status: 'ACTIVE',
    },
  ])

  function acknowledgeAlert(id) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: 'ACKNOWLEDGED' }
          : alert
      )
    )
  }

  function getSeverityIcon(severity) {
    if (severity === 'CRITICAL') {
      return <ShieldAlert size={22} />
    }

    if (severity === 'WARNING') {
      return <AlertTriangle size={22} />
    }

    return <CheckCircle2 size={22} />
  }

  return (
    <div className="warnings-page">

      {/* Page Header */}
      <div className="warnings-header">

        <div>
          <div className="page-eyebrow">
            DISASTER MANAGEMENT / EARLY WARNING
          </div>

          <h1>Early Warning System</h1>

          <p>
            Monitor active flood alerts and coordinate timely
            disaster response actions.
          </p>
        </div>

        <div className="warning-system-status">
          <span className="status-dot"></span>

          <div>
            <small>WARNING SYSTEM</small>
            <strong>OPERATIONAL</strong>
          </div>
        </div>

      </div>


      {/* Summary Cards */}
      <div className="warning-summary">

        <div className="warning-summary-card critical">
          <div className="summary-icon">
            <ShieldAlert size={22} />
          </div>

          <div>
            <span>CRITICAL ALERTS</span>
            <strong>
              {
                alerts.filter(
                  (alert) => alert.severity === 'CRITICAL'
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="warning-summary-card warning">
          <div className="summary-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>ACTIVE WARNINGS</span>
            <strong>
              {
                alerts.filter(
                  (alert) => alert.severity === 'WARNING'
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="warning-summary-card">
          <div className="summary-icon">
            <MapPin size={22} />
          </div>

          <div>
            <span>AFFECTED LOCATIONS</span>
            <strong>{alerts.length}</strong>
          </div>
        </div>


        <div className="warning-summary-card">
          <div className="summary-icon">
            <Radio size={22} />
          </div>

          <div>
            <span>LAST DATA UPDATE</span>
            <strong>2 min</strong>
          </div>
        </div>

      </div>


      {/* Emergency Banner */}
      {alerts.some(
        (alert) =>
          alert.severity === 'CRITICAL' &&
          alert.status === 'ACTIVE'
      ) && (
        <div className="emergency-banner">

          <div className="emergency-icon">
            <Bell size={24} />
          </div>

          <div className="emergency-content">
            <strong>CRITICAL FLOOD RISK REQUIRES ATTENTION</strong>

            <span>
              A high-risk location has been identified.
              Review the alert and initiate appropriate
              response measures.
            </span>
          </div>

          <button className="emergency-action">
            REVIEW ALERT
          </button>

        </div>
      )}


      {/* Alert List */}
      <section className="alerts-section">

        <div className="section-heading">

          <div>
            <span>LIVE MONITORING</span>
            <h2>Active Alerts & Warnings</h2>
          </div>

          <div className="live-indicator">
            <span></span>
            LIVE
          </div>

        </div>


        <div className="alerts-list">

          {alerts.map((alert) => (

            <article
              className={`warning-card ${alert.severity.toLowerCase()}`}
              key={alert.id}
            >

              {/* Severity */}
              <div className="warning-severity">

                <div className="severity-icon">
                  {getSeverityIcon(alert.severity)}
                </div>

                <span>{alert.severity}</span>

              </div>


              {/* Main Content */}
              <div className="warning-main">

                <div className="warning-title-row">

                  <div>
                    <h3>{alert.title}</h3>

                    <div className="location-line">
                      <MapPin size={15} />
                      {alert.location}, {alert.district}
                    </div>
                  </div>

                  <div
                    className={`alert-status ${alert.status.toLowerCase()}`}
                  >
                    {alert.status}
                  </div>

                </div>


                {/* Metrics */}
                <div className="warning-metrics">

                  <div>
                    <span>RISK SCORE</span>

                    <strong className="risk-number">
                      {alert.risk}/100
                    </strong>
                  </div>


                  <div>
                    <span>RAINFALL</span>
                    <strong>{alert.rainfall}</strong>
                  </div>


                  <div>
                    <span>DETECTED</span>

                    <strong>
                      <Clock3 size={14} />
                      {alert.detected}
                    </strong>
                  </div>

                </div>


                {/* Recommended Action */}
                <div className="recommended-action">

                  <div className="action-icon">
                    <Users size={17} />
                  </div>

                  <div>
                    <span>RECOMMENDED RESPONSE</span>
                    <p>{alert.action}</p>
                  </div>

                </div>


                {/* Actions */}
                <div className="warning-actions">

                  {alert.status === 'ACTIVE' ? (
                    <button
                      className="acknowledge-btn"
                      onClick={() =>
                        acknowledgeAlert(alert.id)
                      }
                    >
                      <CheckCircle2 size={16} />
                      ACKNOWLEDGE ALERT
                    </button>
                  ) : (
                    <div className="acknowledged">
                      <CheckCircle2 size={16} />
                      ALERT ACKNOWLEDGED
                    </div>
                  )}

                  <button className="details-btn">
                    VIEW LOCATION
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* Communication Panel */}
      <section className="communication-panel">

        <div className="communication-icon">
          <Radio size={24} />
        </div>

        <div className="communication-text">

          <span>AUTHORITY COMMUNICATION</span>

          <h3>Emergency Warning Dissemination</h3>

          <p>
            Issue warnings to registered response teams,
            field officers and affected communities when
            required.
          </p>

        </div>

        <button className="issue-warning-btn">
          <Bell size={17} />
          ISSUE WARNING
        </button>

      </section>

    </div>
  )
}

export default EarlyWarnings