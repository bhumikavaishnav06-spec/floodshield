import {
  LayoutDashboard,
  Map,
  CloudRain,
  Bell,
  ShieldAlert,
  History,
  Settings,
  Menu,
  Search,
  MapPin,
  Droplets,
  Users,
  Route,
  Activity,
} from 'lucide-react'
import RiskMap from './components/RiskMap'
import WeatherPanel from './components/WeatherPanel'

import './App.css'

function App() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <Droplets size={24} />
          </div>

          <div>
            <h2>FloodShield</h2>
            <span>Disaster Intelligence</span>
          </div>
        </div>

        <nav className="navigation">

          <div className="nav-section">
            <span className="nav-title">MONITORING</span>

            <a className="nav-item active">
              <LayoutDashboard size={19} />
              Overview
            </a>

            <a className="nav-item">
              <Map size={19} />
              Risk Map
            </a>

            <a className="nav-item">
              <CloudRain size={19} />
              Forecast
            </a>
          </div>

          <div className="nav-section">
            <span className="nav-title">RESPONSE</span>

            <a className="nav-item">
              <Bell size={19} />
              Alerts
              <span className="alert-count">3</span>
            </a>

            <a className="nav-item">
              <ShieldAlert size={19} />
              Response
            </a>

            <a className="nav-item">
              <History size={19} />
              History
            </a>
          </div>

        </nav>

        <div className="sidebar-bottom">
          <a className="nav-item">
            <Settings size={19} />
            Settings
          </a>

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>All services operational</small>
            </div>
          </div>
        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <div className="topbar-left">
            <button className="menu-button">
              <Menu size={20} />
            </button>

            <div>
              <p className="page-label">DISASTER MONITORING CENTER</p>
              <h1>Flood Risk Overview</h1>
            </div>
          </div>

          <div className="topbar-right">

            <div className="search-box">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search location..."
              />
            </div>

            <div className="live-status">
              <span></span>
              LIVE
            </div>

          </div>

        </header>


        {/* DASHBOARD */}
        <section className="dashboard-content">

          {/* LOCATION BAR */}
          <div className="location-bar">

            <div>
              <MapPin size={18} />
              <span>Hilly Region Monitoring</span>
            </div>

            <div className="updated">
              Last updated: Just now
            </div>

          </div>


          {/* STAT CARDS */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-top">
                <span>Overall Risk</span>

                <div className="stat-icon danger">
                  <ShieldAlert size={20} />
                </div>
              </div>

              <h2>HIGH</h2>
              <p className="danger-text">↑ 12% from previous assessment</p>
            </div>


            <div className="stat-card">
              <div className="stat-top">
                <span>Rainfall</span>

                <div className="stat-icon blue">
                  <CloudRain size={20} />
                </div>
              </div>

              <h2>86 mm</h2>
              <p>Last 24 hours</p>
            </div>


            <div className="stat-card">
              <div className="stat-top">
                <span>Villages at Risk</span>

                <div className="stat-icon orange">
                  <Users size={20} />
                </div>
              </div>

              <h2>24</h2>
              <p>8 critical zones</p>
            </div>


            <div className="stat-card">
              <div className="stat-top">
                <span>Roads at Risk</span>

                <div className="stat-icon yellow">
                  <Route size={20} />
                </div>
              </div>

              <h2>17</h2>
              <p>4 major routes</p>
            </div>

          </div>


          {/* MAP SECTION */}
          <div className="map-section">

            <div className="map-header">

              <div>
                <h2>Flood Risk Map</h2>
                <p>Real-time regional risk visualization</p>
              </div>

              <div className="map-controls">

                <button className="map-control active">
                  Risk
                </button>

                <button className="map-control">
                  Rainfall
                </button>

                <button className="map-control">
                  Terrain
                </button>

              </div>

            </div>


           <RiskMap />

            <div className="map-legend">

              <span>
                <i className="legend high"></i>
                High Risk
              </span>

              <span>
                <i className="legend moderate"></i>
                Moderate
              </span>

              <span>
                <i className="legend low"></i>
                Low Risk
              </span>

            </div>

          </div>
          <WeatherPanel />


          {/* BOTTOM SECTION */}
          <div className="bottom-grid">

            <div className="panel">

              <div className="panel-header">
                <div>
                  <h3>Critical Locations</h3>
                  <p>Areas requiring immediate attention</p>
                </div>

                <button>View all</button>
              </div>

              <div className="location-item">
                <div className="location-risk high"></div>

                <div className="location-info">
                  <strong>Zone A — Upper Valley</strong>
                  <span>Very High Risk</span>
                </div>

                <b>92%</b>
              </div>

              <div className="location-item">
                <div className="location-risk high"></div>

                <div className="location-info">
                  <strong>Zone B — River Basin</strong>
                  <span>High Risk</span>
                </div>

                <b>78%</b>
              </div>

              <div className="location-item">
                <div className="location-risk moderate"></div>

                <div className="location-info">
                  <strong>Zone C — Hill Settlement</strong>
                  <span>Moderate Risk</span>
                </div>

                <b>61%</b>
              </div>

            </div>


            <div className="panel">

              <div className="panel-header">
                <div>
                  <h3>System Activity</h3>
                  <p>Latest intelligence updates</p>
                </div>
              </div>

              <div className="activity-item">
                <span className="activity-dot"></span>
                Rainfall data updated
                <small>2 min ago</small>
              </div>

              <div className="activity-item">
                <span className="activity-dot"></span>
                Risk model completed
                <small>5 min ago</small>
              </div>

              <div className="activity-item">
                <span className="activity-dot"></span>
                Satellite data synchronized
                <small>12 min ago</small>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default App