// Function that handles building the wind speed string
function buildWindSpeedString (
  windSpeedLow,
  windSpeedHigh,
  windGustLow,
  windGustHigh
) {

  let windSpeed
  let windGust

  // Check for calm conditions ( <5mph )
  if (windSpeedLow < 2) {
    return 'Calm'
  }

  // See if a `windSpeedHigh` value does not exist (set to zero (0))
  if (windSpeedHigh < windSpeedLow) {
    windSpeed = `${Math.round(windSpeedLow)}mph`
  }
  else {
    windSpeed = `${Math.round(windSpeedLow)} - ${Math.round(windSpeedHigh)}mph`
  }

  // Check if a `windGustLow` value exists (set to zero (0) if not supplied).
  // If no wind gust, return the wind speed.
  if (windGustLow < windSpeedLow) {
    return windSpeed
  }

  // Check if a `windGustHigh` value exists (set to zero (0) if not supplied)
  if (windGustHigh < windGustLow) {
    windGust = `G${Math.round(windGustLow)}`
  }
  else {
    windGust = `G${Math.round(windGustLow)} - ${Math.round(windGustHigh)}` 
  }

  // Return the generated full wind speed string
  return `${windSpeed} ${windGust}`
}

export default buildWindSpeedString