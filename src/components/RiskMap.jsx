
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  Polygon,
  Marker,
  LayersControl,
} from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FloodShieldAPI } from '../lib/floodShieldApi'
import './RiskMap.css'


// ======================================================
// Illustrative terrain overlays.
// These are generic steep-slope zone shapes for visual
// context — not tied to live per-village backend data.
// ======================================================

const steepSlopeAreas = [
  [
    [30.55, 78.65],
    [30.72, 78.82],
    [30.61, 79.05],
    [30.42, 78.91],
    [30.55, 78.65],
  ],
  [
    [30.15, 78.75],
    [30.30, 78.90],
    [30.22, 79.15],
    [30.02, 79.02],
    [30.15, 78.75],
  ],
]

// Maps backend's simple color names to hex values for markers/circles
const COLOR_MAP = {
  red: '#ef5350',
  orange: '#ff8a3d',
  gold: '#e5bd42',
  green: '#26c281',
}


const createIcon = (color) =>
  L.divIcon({
    className: 'risk-marker-wrapper',
    html: `
      <div
        class="risk-marker"
        style="
          background:${color};
          box-shadow:
            0 0 0 5px ${color}33,
            0 0 20px ${color}99;
        "
      ></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })


function RiskMap() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await FloodShieldAPI.getRiskData()
      if (res.status === 'success') {
        const mapped = res.data.map((v) => ({
          id: v.name,
          name: v.name,
          position: [v.lat, v.lon],
          risk: v.risk_level,
          score: v.risk_score,
          rainfall: v.weather.rain,
          peopleAtRisk: v.people_at_risk,
          cloudburst: v.cloudburst.level,
          glof: v.glof,
          color: COLOR_MAP[v.color] || '#26c281',
        }))
        setZones(mapped)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="risk-map-wrapper">

      <MapContainer
        center={[30.55, 79.35]}
        zoom={9}
        scrollWheelZoom={true}
        className="risk-map"
      >

        <LayersControl position="topright">

          <LayersControl.BaseLayer checked name="Physical Terrain">
            <TileLayer
              attribution="Map data © OpenStreetMap contributors, SRTM"
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

        </LayersControl>


        {/* Illustrative steep-slope overlays */}

        {steepSlopeAreas.map((area, index) => (
          <Polygon
            key={`slope-${index}`}
            positions={area}
            pathOptions={{
              color: '#ff9f43',
              fillColor: '#ff9f43',
              fillOpacity: 0.18,
              weight: 1.5,
              dashArray: '4 4',
            }}
          >
            <Popup>
              <div className="risk-popup">
                <h3>Steep Slope Area</h3>
                <div className="popup-risk">
                  <span className="popup-risk-dot" style={{ background: '#ff9f43' }}></span>
                  Landslide / Runoff Sensitive
                </div>
                <div className="popup-row"><span>Terrain</span><strong>Steep</strong></div>
                <div className="popup-row"><span>Flood Concern</span><strong>Elevated</strong></div>
              </div>
            </Popup>
          </Polygon>
        ))}


        {/* LIVE VILLAGE RISK CIRCLES */}

        {zones.map((zone) => (
          <Circle
            key={`zone-${zone.id}`}
            center={zone.position}
            radius={4000}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <Popup>
              <div className="risk-popup">
                <h3>{zone.name}</h3>
                <div className="popup-risk">
                  <span className="popup-risk-dot" style={{ background: zone.color }}></span>
                  Risk Level: {zone.risk}
                </div>
                <div className="popup-row"><span>Risk Score</span><strong>{zone.score}/100</strong></div>
                <div className="popup-row"><span>Rainfall (24h)</span><strong>{zone.rainfall} mm</strong></div>
                <div className="popup-row"><span>People at Risk</span><strong>{zone.peopleAtRisk.toLocaleString()}</strong></div>
                <div className="popup-row"><span>Cloudburst</span><strong>{zone.cloudburst.replace(/_/g, ' ')}</strong></div>
                {zone.glof.applicable && (
                  <div className="popup-row"><span>GLOF Risk</span><strong>{zone.glof.risk_level}</strong></div>
                )}
              </div>
            </Popup>
          </Circle>
        ))}


        {/* LIVE VILLAGE MARKERS */}

        {zones.map((zone) => (
          <Marker
            key={`marker-${zone.id}`}
            position={zone.position}
            icon={createIcon(zone.color)}
          >
            <Popup>
              <div className="risk-popup">
                <h3>{zone.name}</h3>
                <div className="popup-risk">
                  <span className="popup-risk-dot" style={{ background: zone.color }}></span>
                  Risk Level: {zone.risk}
                </div>
                <div className="popup-row"><span>Risk Score</span><strong>{zone.score}/100</strong></div>
                <div className="popup-row"><span>People at Risk</span><strong>{zone.peopleAtRisk.toLocaleString()}</strong></div>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>


      <div className="map-overlay">
        <div className="map-overlay-title">LIVE RISK INTELLIGENCE</div>
        <div className="map-overlay-status">
          <span></span>
          {loading ? 'Loading...' : 'Monitoring active'}
        </div>
      </div>


      <div className="risk-legend">
        <strong>FLOODSHIELD GIS LAYERS</strong>
        <div><span className="legend-dot very-high"></span>Critical Risk</div>
        <div><span className="legend-dot high"></span>Warning</div>
        <div><span className="legend-dot moderate"></span>Watch</div>
        <div><span className="legend-dot low"></span>Safe</div>
        <div><span className="legend-dot slope"></span>Steep Slope</div>
      </div>

    </div>
  )
}

export default RiskMap