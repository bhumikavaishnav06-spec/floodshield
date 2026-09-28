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
  Car,
} from 'lucide-react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import RiskMap from '../components/RiskMap'
import WeatherPanel from '../components/WeatherPanel'

import './Dashboard.css'
import EarlyWarnings from './EarlyWarnings'


function Dashboard() {
  const navigate = useNavigate()

  const [activePage, setActivePage] = useState('Dashboard')
  const [mobileMenu, setMobileMenu] = useState(false)


  // ==============================
  // LOGOUT
  // ==============================

  function handleLogout() {
    localStorage.removeItem('floodshield_authority')
    navigate('/login')
  }


  // ==============================
  // SIDEBAR MENU
  // ==============================

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Flood Risk Map',
      icon: Map,
    },
    {
      name: 'Weather & Rainfall',
      icon: CloudRain,
    },
    {
      name: 'Early Warnings',
      icon: Bell,
    },
    {
      name: 'Response & Evacuation',
      icon: Route,
    },
    {
      name: 'Historical Events',
      icon: History,
    },
  ]


  return (
    <div className="dashboard">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`dashboard-sidebar ${
          mobileMenu ? 'mobile-open' : ''
        }`}
      >

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <ShieldCheck size={21} />
          </div>

          <div>

            <h2>
              Flood<span>Shield</span>
            </h2>

            <small>
              DISASTER MANAGEMENT
            </small>

          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>

        </div>


        {/* COMMAND CENTER */}

        <div className="sidebar-section-label">
          COMMAND CENTER
        </div>


        <nav className="sidebar-nav">

          {menuItems.map((item) => {

            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`sidebar-item ${
                  activePage === item.name
                    ? 'active'
                    : ''
                }`}
                onClick={() => {
                  setActivePage(item.name)
                  setMobileMenu(false)
                }}
              >

                <Icon size={17} />

                <span>
                  {item.name}
                </span>

                {item.name === 'Early Warnings' && (
                  <b className="alert-count">
                    3
                  </b>
                )}

              </button>
            )
          })}

        </nav>


        {/* ADMINISTRATION */}

        <div className="sidebar-section-label">
          ADMINISTRATION
        </div>


        <button
          className={`sidebar-item ${
            activePage === 'Reports'
              ? 'active'
              : ''
          }`}
          onClick={() => {
            setActivePage('Reports')
            setMobileMenu(false)
          }}
        >

          <Activity size={17} />

          <span>
            Situation Reports
          </span>

        </button>


        <button
          className={`sidebar-item ${
            activePage === 'Settings'
              ? 'active'
              : ''
          }`}
          onClick={() => {
            setActivePage('Settings')
            setMobileMenu(false)
          }}
        >

          <Settings size={17} />

          <span>
            System Settings
          </span>

        </button>


        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <div className="authority-profile">

            <div className="authority-avatar">
              D
            </div>

            <div>

              <strong>
                DMO Authority
              </strong>

              <small>
                ● Authorized Session
              </small>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >

            <LogOut size={16} />

            <span>
              Sign out
            </span>

          </button>

        </div>

      </aside>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="dashboard-main">


        {/* =========================================
            GOVERNMENT HEADER
        ========================================= */}

        <header className="dashboard-topbar">


          {/* MOBILE MENU */}

          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>


          {/* FLOODSHIELD BRAND */}

          <div className="government-brand">

            <div className="ashoka-placeholder">
              <ShieldCheck size={20} />
            </div>

            <div>

              <div className="government-title">
                FLOODSHIELD
              </div>

              <div className="government-subtitle">
                FLASH FLOOD EARLY WARNING &amp;
                DECISION SUPPORT SYSTEM
              </div>

            </div>

          </div>


          {/* CENTER TITLE */}

          <div className="topbar-center">

            <span>
              DISTRICT DISASTER MANAGEMENT
            </span>

            <strong>
              COMMAND CENTER
            </strong>

          </div>


          {/* RIGHT */}

          <div className="topbar-right">

            <div className="system-live">

              <span></span>

              SYSTEM OPERATIONAL

            </div>


            <div className="topbar-divider"></div>


            <div className="authority-session">

              <small>
                AUTHORITY SESSION
              </small>

              <strong>
                DMO-DEMO
              </strong>

            </div>

          </div>

        </header>


        {/* =========================================
            DASHBOARD CONTENT
        ========================================= */}

        <div className="dashboard-content">


          {/* =====================================
              DASHBOARD
          ===================================== */}

          {activePage === 'Dashboard' && (

            <>

              {/* PAGE INTRO */}

              <div className="welcome-row">

                <div>

                  <p className="eyebrow">
                    REGIONAL FLOOD MONITORING
                  </p>

                  <h2>
                    Disaster Situation Overview
                  </h2>

                  <p>
                    Monitor flood risk, environmental
                    conditions and vulnerable areas.
                  </p>

                </div>


                <div className="last-update">

                  <Activity size={14} />

                  <span>
                    Live data connected
                  </span>

                </div>

              </div>


              {/* =================================
                  RISK SUMMARY
              ================================= */}

              <div className="stat-grid">


                {/* HIGH RISK */}

                <div className="stat-card">

                  <div className="stat-icon danger">
                    <AlertTriangle size={19} />
                  </div>

                  <div>

                    <span>
                      HIGH-RISK AREAS
                    </span>

                    <strong>
                      04
                    </strong>

                    <small>
                      Requires attention
                    </small>

                  </div>

                </div>


                {/* MONITORED */}

                <div className="stat-card">

                  <div className="stat-icon blue">
                    <MapPin size={19} />
                  </div>

                  <div>

                    <span>
                      MONITORED LOCATIONS
                    </span>

                    <strong>
                      24
                    </strong>

                    <small>
                      Regional monitoring
                    </small>

                  </div>

                </div>


                {/* POPULATION */}

                <div className="stat-card">

                  <div className="stat-icon orange">
                    <Users size={19} />
                  </div>

                  <div>

                    <span>
                      ESTIMATED EXPOSURE
                    </span>

                    <strong>
                      12.4K
                    </strong>

                    <small>
                      Population exposure
                    </small>

                  </div>

                </div>


                {/* ROADS */}

                <div className="stat-card">

                  <div className="stat-icon cyan">
                    <Car size={19} />
                  </div>

                  <div>

                    <span>
                      ROADS AT RISK
                    </span>

                    <strong>
                      08
                    </strong>

                    <small>
                      Monitoring required
                    </small>

                  </div>

                </div>

              </div>


              {/* =================================
                  EARLY WARNING BANNER
              ================================= */}

              <div className="warning-banner">

                <div className="warning-icon">
                  <AlertTriangle size={19} />
                </div>

                <div className="warning-content">

                  <strong>
                    ELEVATED FLOOD RISK DETECTED
                  </strong>

                  <span>
                    Increased rainfall conditions
                    require continued monitoring
                    in high-risk regions.
                  </span>

                </div>

                <button
                  onClick={() =>
                    setActivePage('Early Warnings')
                  }
                >
                  VIEW WARNING
                </button>

              </div>


              {/* =================================
                  GIS MAP
              ================================= */}

              <section className="dashboard-section">

                <div className="section-heading">

                  <div>

                    <span>
                      GEOSPATIAL MONITORING
                    </span>

                    <h3>
                      Flood Risk Map
                    </h3>

                  </div>


                  <div className="map-status">

                    <span className="risk-dot high"></span>
                    High

                    <span className="risk-dot medium"></span>
                    Moderate

                    <span className="risk-dot low"></span>
                    Low

                  </div>

                </div>


                <div className="map-container">

                  <RiskMap />

                </div>

              </section>


              {/* =================================
                  LOWER INFORMATION GRID
              ================================= */}

              <div className="lower-grid">


                {/* WEATHER */}

                <WeatherPanel />


                {/* ALERTS */}

                <div className="alerts-card">

                  <div className="card-heading">

                    <div>

                      <span>
                        EARLY WARNING SYSTEM
                      </span>

                      <h3>
                        Active Alerts &amp; Events
                      </h3>

                    </div>

                    <Bell size={18} />

                  </div>


                  <div className="alert-list">


                    {/* ALERT 1 */}

                    <div className="alert-item high-alert">

                      <div className="alert-marker">
                        !
                      </div>

                      <div>

                        <strong>
                          High rainfall detected
                        </strong>

                        <span>
                          Regional monitoring zone
                        </span>

                      </div>

                      <small>
                        Now
                      </small>

                    </div>


                    {/* ALERT 2 */}

                    <div className="alert-item">

                      <div className="alert-marker orange-marker">
                        !
                      </div>

                      <div>

                        <strong>
                          Terrain risk elevated
                        </strong>

                        <span>
                          Mountain slope monitoring
                        </span>

                      </div>

                      <small>
                        12m
                      </small>

                    </div>


                    {/* ALERT 3 */}

                    <div className="alert-item">

                      <div className="alert-marker blue-marker">
                        i
                      </div>

                      <div>

                        <strong>
                          Weather data updated
                        </strong>

                        <span>
                          Live API synchronization
                        </span>

                      </div>

                      <small>
                        18m
                      </small>

                    </div>

                  </div>


                  <button
                    className="view-alerts"
                    onClick={() =>
                      setActivePage('Early Warnings')
                    }
                  >
                    VIEW ALL WARNINGS
                  </button>

                </div>

              </div>

            </>

          )}


          {/* =========================================
              FLOOD RISK MAP
          ========================================= */}

          {activePage === 'Flood Risk Map' && (

            <div className="module-page">

              <div className="module-header">

                <span>
                  GEOSPATIAL INTELLIGENCE
                </span>

                <h2>
                  Flood Risk Map
                </h2>

                <p>
                  Monitor geographic flood-risk
                  conditions and terrain information.
                </p>

              </div>


              <div className="module-map">

                <RiskMap />

              </div>

            </div>

          )}


          {/* =========================================
              WEATHER
          ========================================= */}

          {activePage === 'Weather & Rainfall' && (

            <div className="module-page">

              <div className="module-header">

                <span>
                  ENVIRONMENTAL MONITORING
                </span>

                <h2>
                  Weather &amp; Rainfall
                </h2>

                <p>
                  Current environmental conditions
                  used by FloodShield risk assessment.
                </p>

              </div>


              <div className="module-weather">

                <WeatherPanel />

              </div>

            </div>

          )}


          {/* =========================================
              EARLY WARNINGS
          ========================================= */}

          {activePage === 'Early Warnings' && (

            <div className="module-page">

              <div className="module-header">

                <span>
                  EMERGENCY MONITORING
                </span>

                <h2>
                  Early Warnings
                </h2>

                <p>
                  Monitor active risk conditions
                  requiring authority attention.
                </p>

              </div>


              <div className="full-alerts-card">

                <div className="alert-item high-alert">

                  <div className="alert-marker">
                    !
                  </div>

                  <div>

                    <strong>
                      High rainfall detected
                    </strong>

                    <span>
                      Regional monitoring zone
                    </span>

                  </div>

                  <small>
                    ACTIVE
                  </small>

                </div>


                <div className="alert-item">

                  <div className="alert-marker orange-marker">
                    !
                  </div>

                  <div>

                    <strong>
                      Terrain risk elevated
                    </strong>

                    <span>
                      Mountain slope monitoring
                    </span>

                  </div>

                  <small>
                    MONITOR
                  </small>

                </div>


                <div className="alert-item">

                  <div className="alert-marker blue-marker">
                    i
                  </div>

                  <div>

                    <strong>
                      Weather data updated
                    </strong>

                    <span>
                      Live API synchronization
                    </span>

                  </div>

                  <small>
                    UPDATED
                  </small>

                </div>

              </div>

            </div>

          )}


          {/* =========================================
              OTHER MODULES
          ========================================= */}

          {[
            'Response & Evacuation',
            'Historical Events',
            'Reports',
            'Settings',
          ].includes(activePage) && (

            <div className="placeholder-page">

              <div className="placeholder-icon">
                <Activity size={25} />
              </div>

              <span>
                FLOODSHIELD MODULE
              </span>

              <h2>
                {activePage}
              </h2>

              <p>
                This module is ready for integration
                with the FloodShield backend.
              </p>

            </div>

          )}

        </div>

      </main>

    </div>
  )
}


export default Dashboard