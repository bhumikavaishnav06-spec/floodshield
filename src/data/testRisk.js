import { calculateFloodRisk } from './riskEngine.js'

const result = calculateFloodRisk({
  rainfall: 118,
  rainfallIntensity: 45,
  soilMoisture: 0.35,
  slope: 30,
})

console.log('FloodShield Risk Result:')
console.log(result)