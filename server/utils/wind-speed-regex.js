  // Function that takes in a wind string field and gets the
  // various values out and returns each individual wind
  // speed field
  function getWindSpeedValues(windSpeed) {
  
  // Use REGEX to break apart the wind string to the
  // specific values in an array
  const windMatches = windSpeed.match(
    /^(\d{1,3})[\s-]*(\d{1,3}[\s]*)*(mph){0,1}\s*[gG]{0,1}(\d{0,3})[\s-]*(\d{0,3})$/
  )

  return {
    // Set the individual wind speed values
    windSpeedLow: windMatches[1] ? windMatches[1] : 0,
    windSpeedHigh: windMatches[2] ? windMatches[2] : null,
    windGustLow: windMatches[4] ? windMatches[4] : null,
    windGustHigh: windMatches[5] ? windMatches[5] : null
  }
}

module.exports = { getWindSpeedValues }