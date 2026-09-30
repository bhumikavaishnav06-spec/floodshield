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
import './RiskMap.css'


// ======================================================
// FLOOD RISK ZONES
// Demo data for frontend development.
// Later these values will come from the ML/backend system.
// ======================================================

const riskZones = [
  {
    id: 1,
    name: 'Upper Valley',
    position: [30.0668, 79.0193],
    risk: 'Very High',
    probability: 92,
    rainfall: 118,
    color: '#ef5350',
  },
  {
    id: 2,
    name: 'River Basin',
    position: [30.3165, 78.0322],
    risk: 'High',
    probability: 78,
    rainfall: 86,
    color: '#ff8a3d',
  },
  {
    id: 3,
    name: 'Hill Settlement',
    position: [31.1048, 77.1734],
    risk: 'Moderate',
    probability: 61,
    rainfall: 64,
    color: '#e5bd42',
  },
]


// ======================================================
// STEEP SLOPE AREAS
// Demo polygons for frontend visualization.
// Later these will be generated from DEM/elevation data.
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


// ======================================================
// CUSTOM RISK MARKER
// ======================================================

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
  return (
    <div className="risk-map-wrapper">

      {/* ==================================================
          MAP
      ================================================== */}

      <MapContainer
        center={[30.3165, 78.0322]}
        zoom={7}
        scrollWheelZoom={true}
        className="risk-map"
      >

        {/* ==================================================
            BASE MAP LAYERS
        ================================================== */}

        <LayersControl position="topright">

          {/* PHYSICAL / TERRAIN MAP */}

          <LayersControl.BaseLayer
            checked
            name="Physical Terrain"
          >
            <TileLayer
              attribution="Map data © OpenStreetMap contributors, SRTM"
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>


          {/* SATELLITE MAP */}

          <LayersControl.BaseLayer
            name="Satellite"
          >
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>


          {/* NORMAL STREET MAP */}

          <LayersControl.BaseLayer
            name="Street Map"
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

        </LayersControl>


        {/* ==================================================
            STEEP SLOPE AREAS
        ================================================== */}

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

                <h3>
                  Steep Slope Area
                </h3>

                <div className="popup-risk">

                  <span
                    className="popup-risk-dot"
                    style={{
                      background: '#ff9f43',
                    }}
                  ></span>

                  Landslide / Runoff Sensitive

                </div>

                <div className="popup-row">
                  <span>Terrain</span>
                  <strong>Steep</strong>
                </div>

                <div className="popup-row">
                  <span>Flood Concern</span>
                  <strong>Elevated</strong>
                </div>

              </div>

            </Popup>

          </Polygon>

        ))}


        {/* ==================================================
            FLOOD RISK CIRCLES
        ================================================== */}

        {riskZones.map((zone) => (

          <Circle
            key={`zone-${zone.id}`}
            center={zone.position}
            radius={18000}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.25,
              weight: 2,
            }}
          >

            <Popup>

              <div className="risk-popup">

                <h3>
                  {zone.name}
                </h3>

                <div className="popup-risk">

                  <span
                    className="popup-risk-dot"
                    style={{
                      background: zone.color,
                    }}
                  ></span>

                  {zone.risk} Risk

                </div>

                <div className="popup-row">
                  <span>Flood Probability</span>
                  <strong>
                    {zone.probability}%
                  </strong>
                </div>

                <div className="popup-row">
                  <span>Rainfall</span>
                  <strong>
                    {zone.rainfall} mm
                  </strong>
                </div>

              </div>

            </Popup>

          </Circle>

        ))}


        {/* ==================================================
            HIGH RISK REGION
        ================================================== */}

        <Polygon
          positions={[
            [30.45, 78.65],
            [30.65, 79.05],
            [30.35, 79.35],
            [30.05, 79.05],
            [30.15, 78.7],
          ]}
          pathOptions={{
            color: '#ef5350',
            fillColor: '#ef5350',
            fillOpacity: 0.16,
            weight: 2,
            dashArray: '6 6',
          }}
        >

          <Popup>

            <div className="risk-popup">

              <h3>
                High Risk Region
              </h3>

              <div className="popup-risk">

                <span
                  className="popup-risk-dot"
                  style={{
                    background: '#ef5350',
                  }}
                ></span>

                Flood Sensitive Area

              </div>

              <div className="popup-row">
                <span>Status</span>
                <strong>Monitor</strong>
              </div>

            </div>

          </Popup>

        </Polygon>


        {/* ==================================================
            LOCATION MARKERS
        ================================================== */}

        {riskZones.map((zone) => (

          <Marker
            key={`marker-${zone.id}`}
            position={zone.position}
            icon={createIcon(zone.color)}
          >

            <Popup>

              <div className="risk-popup">

                <h3>
                  {zone.name}
                </h3>

                <div className="popup-risk">

                  <span
                    className="popup-risk-dot"
                    style={{
                      background: zone.color,
                    }}
                  ></span>

                  {zone.risk} Risk

                </div>

                <div className="popup-row">
                  <span>Probability</span>
                  <strong>
                    {zone.probability}%
                  </strong>
                </div>

                <div className="popup-row">
                  <span>Rainfall</span>
                  <strong>
                    {zone.rainfall} mm
                  </strong>
                </div>

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>


      {/* ==================================================
          LIVE MAP STATUS
      ================================================== */}

      <div className="map-overlay">

        <div className="map-overlay-title">
          LIVE RISK INTELLIGENCE
        </div>

        <div className="map-overlay-status">

          <span></span>

          Monitoring active

        </div>

      </div>


      {/* ==================================================
          GIS LEGEND
      ================================================== */}

      <div className="risk-legend">

        <strong>
          FLOODSHIELD GIS LAYERS
        </strong>

        <div>
          <span className="legend-dot very-high"></span>
          Very High Flood Risk
        </div>

        <div>
          <span className="legend-dot high"></span>
          High Flood Risk
        </div>

        <div>
          <span className="legend-dot moderate"></span>
          Moderate Risk
        </div>

        <div>
          <span className="legend-dot low"></span>
          Low Risk
        </div>

        <div>
          <span className="legend-dot slope"></span>
          Steep Slope
        </div>

      </div>

    </div>
  )
}

export default RiskMap