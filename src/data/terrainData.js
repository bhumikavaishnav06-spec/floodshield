// ================================================
// FloodShield Terrain Intelligence
// ================================================

// Temporary terrain dataset for development.
// These values will later be replaced with
// real DEM-derived elevation and slope data.

const terrainData = {
  dehradun: {
    name: 'Dehradun Region',

    elevation: 640,

    slope: 12,

    terrainType: 'Valley / Foothill',

    drainageRisk: 'Moderate',
  },

  upperValley: {
    name: 'Upper Valley',

    elevation: 1850,

    slope: 32,

    terrainType: 'Steep Mountain',

    drainageRisk: 'High',
  },

  riverBasin: {
    name: 'River Basin',

    elevation: 520,

    slope: 8,

    terrainType: 'River Valley',

    drainageRisk: 'High',
  },

  hillSettlement: {
    name: 'Hill Settlement',

    elevation: 1450,

    slope: 27,

    terrainType: 'Mountain Slope',

    drainageRisk: 'High',
  },
}


export function getTerrainData(location = 'dehradun') {

  return (
    terrainData[location] ||
    terrainData.dehradun
  )

}


export function calculateTerrainRisk(slope) {

  if (slope >= 35) {
    return {
      score: 20,
      level: 'VERY HIGH',
    }
  }

  if (slope >= 25) {
    return {
      score: 15,
      level: 'HIGH',
    }
  }

  if (slope >= 15) {
    return {
      score: 10,
      level: 'MODERATE',
    }
  }

  if (slope >= 5) {
    return {
      score: 5,
      level: 'LOW',
    }
  }

  return {
    score: 0,
    level: 'VERY LOW',
  }
}