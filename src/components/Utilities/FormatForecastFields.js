// Import the core libraries and functions
import { format } from "date-fns"         // date-fns REF: https://date-fns.org/v2.24.0/docs/format
import { useSelector } from "react-redux"

// Import utility functions
import buildWindSpeedString from "./CreateWindSpeedString"


// Function that returns an object with the forecast
// fields editted for easy display to the DOM
function setForecastFieldsForDisplay (forecastObj) {

  // Get the cloud cover STORE values from REDUX
  const cloudCoverList = useSelector(store => store.config.cloudCover)
  // Get the wind direction STORE values from REDUX
  const windDirectionList = useSelector(store => store.config.windDirection)


  // Return the various forecast values set to formatted
  // strings and ready for easy display to the DOM
  const forecastStrings = {
    // The date the forecast was created for
    forecastForDate: format(new Date(forecastObj.forecast_for_date), "E. MMM dd, yyyy"),

    // Set the high and low temperature fields
    highTemp: `${Math.round(forecastObj.high_temp)}°F`,
    lowTemp: `${Math.round(forecastObj.low_temp)}°F`,

    // Set the possibility of precipitation percentage
    pop: (forecastObj.pop) ? `${Math.round(forecastObj.pop)}%` : null,

    // Set the cloud cover (current just a string)
    cloudCover: cloudCoverList.find(cloud => cloud.id === forecastObj.cloud_cover).name,
    cloudCoverImg: cloudCoverList.find(cloud => cloud.id === forecastObj.cloud_cover).image,
    cloudCoverDescription: cloudCoverList.find(cloud => cloud.id === forecastObj.cloud_cover).description,

    // If the wind speed is not calm, continue constructing the wind string
    windSpeed: buildWindSpeedString(forecastObj.wind_speed_low, forecastObj.wind_speed_high, forecastObj.wind_gust_low, forecastObj.wind_gust_high),

    // Get the wind direction -- using abbreviation for direction
    windDirection: windDirectionList.find(wind => wind.id === forecastObj.wind_direction).abbreviation,

    // String stating when the forecast was created
    forecastCreationDateTime: format(new Date(forecastObj.created_on), "MMM dd, yyyy - h:mm aaa"),
    // Date string value from when the forecast was created
    forecastCreationDate: format(new Date(forecastObj.created_on), "MMM dd, yyyy"),
    // Time string value from when the forecast was created
    forecastCreationTime: format(new Date(forecastObj.created_on), "h:mm aaa")
  }

  // Create a string that contains all the important information regarding wind fields
  forecastStrings.windString = (forecastStrings.windSpeed === 'Calm') ? 'Calm' : `${forecastStrings.windDirection} ${forecastStrings.windSpeed}`


  // Return the forecast strings for easier display
  return forecastStrings
}


export default setForecastFieldsForDisplay