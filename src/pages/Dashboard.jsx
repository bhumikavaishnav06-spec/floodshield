import {
  LayoutDashboard,
  Map,
  CloudRain,
  Bell,
  Route,
  History,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Activity,
  AlertTriangle,
  MapPin,
  Users,
} from 'lucide-react'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import RiskMap from '../components/RiskMap'
import WeatherPanel from '../components/WeatherPanel'
import { FloodShieldAPI } from '../lib/floodShieldApi'

import './Dashboard.css'
import EarlyWarnings from './EarlyWarnings'
import ResponseEvacuation from './ResponseEvacuation'
import HistoricalEvents from './HistoricalEvents'
import Reports from './Reports'
import SettingsPage from './Settings'
import LocationSearch from '../components/LocationSearch'

function formatCompact(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return String(num)
}


function Dashboard() {
  const navigate = useNavigate()

  const [activePage, setActivePage] = useState('Dashboard')
  const [mobileMenu, setMobileMenu] = useState(false)

  const [villages, setVillages] = useState([])
  const [cloudburstAlerts, setCloudburstAlerts] = useState([])
  const [dataLoading, setDataLoading] = useState(true)


  useEffect(() => {
    async function loadSummary() {
      const [riskRes, cbRes] = await Promise.all([
        FloodShieldAPI.getRiskData(),
        FloodShieldAPI.getCloudburstMonitor(),
      ])
      if (riskRes.status === 'success') setVillages(riskRes.data)
      if (cbRes.status === 'success') setCloudburstAlerts(cbRes.alerts)
      setDataLoading(false)
    }
    loadSummary()

    const interval = setInterval(loadSummary, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])


  const highRiskCount = villages.filter((v) => v.risk_level === 'CRITICAL').length
  const totalPeopleAtRisk = villages.reduce((sum, v) => sum + v.people_at_risk, 0)
  const glofActiveCount = villages.filter(
    (v) => v.glof.applicable && v.glof.risk_level !== 'LOW'
  ).length
  const criticalVillages = villages.filter((v) => v.risk_level === 'CRITICAL')

  const combinedAlerts = [
    ...cloudburstAlerts.map((a) => ({
      type: a.level === 'CLOUDBURST_IMMINENT' ? 'high-alert' : 'orange-marker',
      title: a.level === 'CLOUDBURST_IMMINENT'
        ? 'Cloudburst imminent'
        : 'Elevated rainfall detected',
      subtitle: `${a.village} — ${a.current_rate_mm_hr}mm/hr`,
      time: 'Now',
    })),
    ...villages
      .filter((v) => v.glof.applicable && v.glof.risk_level !== 'LOW')
      .map((v) => ({
        type: 'orange-marker',
        title: 'GLOF risk elevated',
        subtitle: `${v.name} — ${v.glof.lake_name}`,
        time: 'Live',
      })),
    {
      type: 'blue-marker',
      title: 'Weather data updated',
      subtitle: 'Live API synchronization',
      time: 'Live',
    },
  ].slice(0, 3)


  function handleLogout() {
    localStorage.removeItem('floodshield_authority')
    navigate('/login')
  }


  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Flood Risk Map', icon: Map },
    { name: 'Weather & Rainfall', icon: CloudRain },
    { name: 'Early Warnings', icon: Bell },
    { name: 'Response & Evacuation', icon: Route },
    { name: 'Historical Events', icon: History },
  ]


  return (
    <div className="dashboard">

      <aside className={`dashboard-sidebar ${mobileMenu ? 'mobile-open' : ''}`}>

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <ShieldCheck size={21} />
          </div>
          <div>
            <h2>Flood<span>Shield</span></h2>
            <small>DISASTER MANAGEMENT</small>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-section-label">COMMAND CENTER</div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                className={`sidebar-item ${activePage === item.name ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.name)
                  setMobileMenu(false)
                }}
              >
                <Icon size={17} />
                <span>{item.name}</span>
                {item.name === 'Early Warnings' && cloudburstAlerts.length + glofActiveCount > 0 && (
                  <b className="alert-count">
                    {cloudburstAlerts.length + glofActiveCount}
                  </b>
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-section-label">ADMINISTRATION</div>

        <button
          className={`sidebar-item ${activePage === 'Reports' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('Reports')
            setMobileMenu(false)
          }}
        >
          <Activity size={17} />
          <span>Situation Reports</span>
        </button>

        <button
          className={`sidebar-item ${activePage === 'Settings' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('Settings')
            setMobileMenu(false)
          }}
        >
          <Settings size={17} />
          <span>System Settings</span>
        </button>

        <div className="sidebar-bottom">
          <div className="authority-profile">
            <div className="authority-avatar">D</div>
            <div>
              <strong>DMO Authority</strong>
              <small>● Authorized Session</small>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>

      </aside>


      <main className="dashboard-main">

        <header className="dashboard-topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>

          <div className="government-brand">
            <div className="ashoka-placeholder">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="government-title">FLOODSHIELD</div>
              <div className="government-subtitle">
                FLASH FLOOD EARLY WARNING &amp; DECISION SUPPORT SYSTEM
              </div>
            </div>
          </div>

          <div className="topbar-center">
            <span>DISTRICT DISASTER MANAGEMENT</span>
            <strong>COMMAND CENTER</strong>
          </div>

          <div className="topbar-right">
            <div className="system-live">
              <span></span>
              SYSTEM OPERATIONAL
            </div>
            <div className="topbar-divider"></div>
            <div className="authority-session">
              <small>AUTHORITY SESSION</small>
              <strong>DMO-DEMO</strong>
            </div>
          </div>
        </header>


        <div className="dashboard-content">

          {activePage === 'Dashboard' && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">REGIONAL FLOOD MONITORING</p>
                  <h2>Disaster Situation Overview</h2>
                  <p>Monitor flood risk, environmental conditions and vulnerable areas.</p>
                </div>
                <div className="last-update">
                  <Activity size={14} />
                  <span>{dataLoading ? 'Connecting...' : 'Live data connected'}</span>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-icon danger"><AlertTriangle size={19} /></div>
                  <div>
                    <span>HIGH-RISK AREAS</span>
                    <strong>{String(highRiskCount).padStart(2, '0')}</strong>
                    <small>Requires attention</small>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue"><MapPin size={19} /></div>
                  <div>
                    <span>MONITORED LOCATIONS</span>
                    <strong>{String(villages.length).padStart(2, '0')}</strong>
                    <small>Regional monitoring</small>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange"><Users size={19} /></div>
                  <div>
                    <span>ESTIMATED EXPOSURE</span>
                    <strong>{formatCompact(totalPeopleAtRisk)}</strong>
                    <small>Population exposure</small>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon cyan"><CloudRain size={19} /></div>
                  <div>
                    <span>CLOUDBURST ALERTS</span>
                    <strong>{String(cloudburstAlerts.length).padStart(2, '0')}</strong>
                    <small>Active monitoring</small>
                  </div>
                </div>
              </div>

              {criticalVillages.length > 0 && (
                <div className="warning-banner">
                  <div className="warning-icon"><AlertTriangle size={19} /></div>
                  <div className="warning-content">
                    <strong>ELEVATED FLOOD RISK DETECTED</strong>
                    <span>
                      {criticalVillages.map((v) => v.name).join(', ')} —
                      CRITICAL risk level. Immediate evacuation readiness advised.
                    </span>
                  </div>
                  <button onClick={() => setActivePage('Early Warnings')}>VIEW WARNING</button>
                </div>
              )}

              <section className="dashboard-section">
                <div className="section-heading">
                  <div>
                    <span>GEOSPATIAL MONITORING</span>
                    <h3>Flood Risk Map</h3>
                  </div>
                  <div className="map-status">
                    <span className="risk-dot high"></span>High
                    <span className="risk-dot medium"></span>Moderate
                    <span className="risk-dot low"></span>Low
                  </div>
                </div>
                <div className="map-container">
                  <RiskMap />
                </div>
              </section>

              <div className="lower-grid">
                <WeatherPanel />
                <div className="alerts-card">
                  <div className="card-heading">
                    <div>
                      <span>EARLY WARNING SYSTEM</span>
                      <h3>Active Alerts &amp; Events</h3>
                    </div>
                    <Bell size={18} />
                  </div>
                  <div className="alert-list">
                    {combinedAlerts.map((a, i) => (
                      <div key={i} className={`alert-item ${a.type === 'high-alert' ? 'high-alert' : ''}`}>
                        <div className={`alert-marker ${a.type === 'high-alert' ? '' : a.type}`}>
                          {a.type === 'blue-marker' ? 'i' : '!'}
                        </div>
                        <div>
                          <strong>{a.title}</strong>
                          <span>{a.subtitle}</span>
                        </div>
                        <small>{a.time}</small>
                      </div>
                    ))}
                  </div>
                  <button className="view-alerts" onClick={() => setActivePage('Early Warnings')}>
                    VIEW ALL WARNINGS
                  </button>
                </div>
              </div>
            </>
          )}

          {activePage === 'Flood Risk Map' && (
            <div className="module-page">
              <div className="module-header">
                <span>GEOSPATIAL INTELLIGENCE</span>
                <h2>Flood Risk Map</h2>
                <p>Monitor geographic flood-risk conditions and terrain information.</p>
              </div>
              <div className="module-map"><RiskMap /></div>
            </div>
          )}

          {activePage === 'Weather & Rainfall' && (
            <div className="module-page">
              <div className="module-header">
                <span>ENVIRONMENTAL MONITORING</span>
                <h2>Weather &amp; Rainfall</h2>
                <p>Current environmental conditions used by FloodShield risk assessment.</p>
              </div>
              <div className="module-weather"><WeatherPanel /></div>
            </div>
          )}

          {activePage === 'Early Warnings' && <EarlyWarnings />}
          {activePage === 'Response & Evacuation' && <ResponseEvacuation />}
          {activePage === 'Historical Events' && <HistoricalEvents />}
          {activePage === 'Reports' && <Reports />}
          {activePage === 'Settings' && <SettingsPage />}

        </div>
      </main>
    </div>
  )
}

export default Dashboard
