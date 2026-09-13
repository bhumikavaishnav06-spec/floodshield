// ================================================
// FloodShield Risk Engine
// Baseline rule-based model
// ================================================

export function calculateFloodRisk({
  rainfall,
  rainfallIntensity,
  soilMoisture,
  slope,
}) {

  // --------------------------------
  // 1. RAINFALL SCORE
  // --------------------------------

  let rainfallScore = 0

  if (rainfall >= 100) {
    rainfallScore = 40
  } else if (rainfall >= 75) {
    rainfallScore = 30
  } else if (rainfall >= 50) {
    rainfallScore = 20
  } else if (rainfall >= 25) {
    rainfallScore = 10
  }


  // --------------------------------
  // 2. RAINFALL INTENSITY SCORE
  // --------------------------------

  let intensityScore = 0

  if (rainfallIntensity >= 50) {
    intensityScore = 25
  } else if (rainfallIntensity >= 30) {
    intensityScore = 20
  } else if (rainfallIntensity >= 20) {
    intensityScore = 15
  } else if (rainfallIntensity >= 10) {
    intensityScore = 8
  }


  // --------------------------------
  // 3. SOIL MOISTURE SCORE
  // --------------------------------

  let soilScore = 0

  if (soilMoisture >= 0.4) {
    soilScore = 15
  } else if (soilMoisture >= 0.3) {
    soilScore = 12
  } else if (soilMoisture >= 0.2) {
    soilScore = 8
  } else if (soilMoisture >= 0.1) {
    soilScore = 4
  }


  // --------------------------------
  // 4. SLOPE SCORE
  // --------------------------------

  let slopeScore = 0

  if (slope >= 35) {
    slopeScore = 20
  } else if (slope >= 25) {
    slopeScore = 15
  } else if (slope >= 15) {
    slopeScore = 10
  } else if (slope >= 5) {
    slopeScore = 5
  }


  // --------------------------------
  // TOTAL RISK SCORE
  // --------------------------------

  let score =
    rainfallScore +
    intensityScore +
    soilScore +
    slopeScore


  // Keep score between 0 and 100

  score = Math.min(100, Math.max(0, score))


  // --------------------------------
  // RISK LEVEL
  // --------------------------------

  let level = 'LOW'

  if (score >= 75) {
    level = 'VERY HIGH'
  } else if (score >= 50) {
    level = 'HIGH'
  } else if (score >= 25) {
    level = 'MODERATE'
  }


  return {
    score,
    level,
    components: {
      rainfallScore,
      intensityScore,
      soilScore,
      slopeScore,
    },
  }
}