import { useEffect, useMemo, useState } from 'react'
import './LocationSearch.css'

const RISK_COLORS = {
  CRITICAL: '#ef5350',
  WARNING: '#ff8a3d',
  WATCH: '#e5bd42',
  SAFE: '#26c281',
}

function formatNumber(value, maximumFractionDigits = 1) {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 'Not available'
  }

  return number.toLocaleString('en-IN', {
    maximumFractionDigits,
  })
}

function formatMeasurement(value, unit) {
  const formatted = formatNumber(value)

  return formatted === 'Not available'
    ? formatted
    : `${formatted} ${unit}`
}

function cloudburstLabel(cloudburst) {
  if (!cloudburst || cloudburst.status !== 'ok') {
    return 'Unavailable or unverified'
  }

  // An hourly model threshold is not confirmation of a cloudburst.
  if (cloudburst.level === 'CLOUDBURST_IMMINENT') {
    return 'Extreme-rainfall threshold flag'
  }

  if (cloudburst.level === 'NORMAL') {
    return 'No threshold flag in supplied forecast'
  }

  return cloudburst.level?.replace(/_/g, ' ') || 'Not available'
}

export default function LocationSearch({
  villages = [],
  loading = false,
  error = '',
  onLocationChange,
}) {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('')
  const [selectedName, setSelectedName] = useState('')

  const locations = useMemo(
    () =>
      Array.isArray(villages)
        ? villages.filter((village) => typeof village?.name === 'string')
        : [],
    [villages],
  )

  const districts = useMemo(
    () =>
      [...new Set(locations.map((village) => village.district).filter(Boolean))]
        .sort(),
    [locations],
  )

  const matchingLocations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return locations
      .filter((village) => {
        const matchesDistrict =
          !district || village.district === district

        const searchableText =
          `${village.name} ${village.district || ''}`.toLowerCase()

        return matchesDistrict && searchableText.includes(query)
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [locations, district, search])

  // If a filter removes the previous selection, feature the first match.
  const selectedVillage =
    matchingLocations.find((village) => village.name === selectedName) ||
    matchingLocations[0] ||
    null

  useEffect(() => {
    onLocationChange?.(selectedVillage)
  }, [selectedVillage, onLocationChange])

  function resetFilters() {
    setSearch('')
    setDistrict('')
    setSelectedName('')
  }

  const weather = selectedVillage?.weather || {}
  const riskColor =
    RISK_COLORS[selectedVillage?.risk_level] || '#94a3b8'

  return (
    <section className="fs-location-panel">
      <div className="fs-location-heading">
        <div>
          <span className="fs-location-eyebrow">
            LOCATION EXPLORER
          </span>

          <h3>Check conditions by location</h3>

          <p>
            Search monitored villages or filter by district.
          </p>
        </div>

        <button
          type="button"
          className="fs-location-reset"
          onClick={resetFilters}
        >
          Reset filters
        </button>
      </div>

      <div className="fs-location-controls">
        <div>
          <label htmlFor="fs-location-search">
            Search village or district
          </label>

          <input
            id="fs-location-search"
            type="search"
            placeholder="Try Kedarnath, Joshimath or Chamoli..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setSelectedName('')
            }}
          />
        </div>

        <div>
          <label htmlFor="fs-district-select">
            District / region
          </label>

          <select
            id="fs-district-select"
            value={district}
            onChange={(event) => {
              setDistrict(event.target.value)
              setSelectedName('')
            }}
          >
            <option value="">All monitored districts</option>

            {districts.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fs-village-select">
            Village / location
          </label>

          <select
            id="fs-village-select"
            value={selectedVillage?.name || ''}
            disabled={matchingLocations.length === 0}
            onChange={(event) => setSelectedName(event.target.value)}
          >
            {matchingLocations.length === 0 && (
              <option value="">No matching locations</option>
            )}

            {matchingLocations.map((village) => (
              <option key={village.name} value={village.name}>
                {village.name}
                {village.district ? ` — ${village.district}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="fs-location-error" role="alert">
          {error}
          {locations.length > 0 && (
            <span> Showing the last available backend snapshot.</span>
          )}
        </div>
      )}

      {loading && locations.length === 0 && (
        <p className="fs-location-message" role="status">
          Loading monitored locations...
        </p>
      )}

      {!loading && !selectedVillage && (
        <p className="fs-location-message" role="status">
          {locations.length === 0
            ? 'No location data is available from the backend.'
            : 'No monitored location matches these filters. Try another name or reset the filters.'}
        </p>
      )}

      {selectedVillage && (
        <div className="fs-location-details">
          <div className="fs-location-selected">
            <div>
              <h4>{selectedVillage.name}</h4>

              <p>
                {selectedVillage.district || 'District not supplied'}
                {' · '}
                {matchingLocations.length} matching location
                {matchingLocations.length === 1 ? '' : 's'}
              </p>
            </div>

            <span
              className="fs-location-badge"
              style={{
                color: riskColor,
                borderColor: riskColor,
              }}
            >
              {selectedVillage.risk_level || 'UNKNOWN'}
            </span>
          </div>

          <dl className="fs-condition-grid">
            <div>
              <dt>Backend risk score</dt>
              <dd>
                {formatMeasurement(selectedVillage.risk_score, '/ 100')}
              </dd>
            </div>

            <div>
              <dt>Temperature</dt>
              <dd>{formatMeasurement(weather.temp, '°C')}</dd>
            </div>

            <div>
              <dt>Rainfall — backend total</dt>
              <dd>{formatMeasurement(weather.rain, 'mm')}</dd>
            </div>

            <div>
              <dt>Soil wetness proxy score</dt>
              <dd>{formatMeasurement(weather.soil, '/ 100')}</dd>
            </div>

            <div>
              <dt>Configured elevation</dt>
              <dd>{formatMeasurement(selectedVillage.elev, 'm')}</dd>
            </div>

            <div>
              <dt>Model-estimated exposure</dt>
              <dd>
                {formatNumber(selectedVillage.people_at_risk, 0)}
              </dd>
            </div>
          </dl>

          <div className="fs-location-hazards">
            <p>
              <strong>Rainfall threshold indicator:</strong>{' '}
              {cloudburstLabel(selectedVillage.cloudburst)}
            </p>

            <p>
              <strong>Experimental GLOF indicator:</strong>{' '}
              {selectedVillage.glof?.applicable
                ? selectedVillage.glof.risk_level || 'Not available'
                : 'Not assessed for this location'}
            </p>
          </div>
        </div>
      )}

      <p className="fs-location-note">
        Prototype backend indicators—not official warnings. Risk scores are
        not flood probabilities. The current API does not identify the
        rainfall total’s time window or consistently distinguish fallback data.
      </p>
    </section>
  )
}