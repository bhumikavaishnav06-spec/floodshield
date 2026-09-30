const BASE_URL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

async function safeFetch(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('FloodShield API Error:', url, err.message)
    return { status: 'error', message: err.message }
  }
}

export const FloodShieldAPI = {
  getRiskData: () => safeFetch(`${BASE_URL}/api/get-risk-data`),
  getHazardBreakdown: (village) => safeFetch(`${BASE_URL}/api/hazard-breakdown/${village}`),
  getCloudburstMonitor: () => safeFetch(`${BASE_URL}/api/cloudburst-monitor`),
  getGlofRisk: (village) => safeFetch(`${BASE_URL}/api/glof-risk/${village}`),
  getSeismicActivity: () => safeFetch(`${BASE_URL}/api/seismic-activity`),
  getEvacuationPlan: (village, scope = 'at_risk') =>
  safeFetch(`${BASE_URL}/api/evacuation-plan/${encodeURIComponent(village)}?scope=${scope}`),
  getShelters: () => safeFetch(`${BASE_URL}/api/shelters`),
  getForecast: (village) => safeFetch(`${BASE_URL}/api/forecast/${village}`),
  getHistory: (village, limit = 50) => safeFetch(`${BASE_URL}/api/history/${village}?limit=${limit}`),
  getTrend: (village) => safeFetch(`${BASE_URL}/api/trend/${village}`),
  getAlertLog: (limit = 20) => safeFetch(`${BASE_URL}/api/alert-log?limit=${limit}`),
  getSmsAlerts: () => safeFetch(`${BASE_URL}/api/sms-alerts`),
  getSmsLog: (limit = 50) => safeFetch(`${BASE_URL}/api/sms-log?limit=${limit}`),
  getPredictTrend: (village) => safeFetch(`${BASE_URL}/api/predict-trend/${village}`),
  reportDownloadUrl: `${BASE_URL}/api/report/download`,
  mapUrl: `${BASE_URL}/api/map`,
  chartUrl: `${BASE_URL}/api/chart`,
  baseUrl: BASE_URL,
  getHealth: () => safeFetch(`${BASE_URL}/`),

  connectLiveAlerts: (onMessage) => {
    const ws = new WebSocket(`${BASE_URL.replace('http', 'ws')}/ws/live-alerts`)
    ws.onmessage = (event) => onMessage(JSON.parse(event.data))
    ws.onerror = (err) => console.error('WebSocket error:', err)
    return ws
  },
}