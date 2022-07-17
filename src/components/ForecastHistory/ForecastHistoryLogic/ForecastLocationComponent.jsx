// Import used libraries and functions
import { useSelector } from "react-redux"

// Import used components
import ForecastDayComponent from "./ForecastDayComponent"


// Component that takes in an array of nested arrays for
// a specific location.
//
// [[...], [...], ..., [...]]
//
// Sends a singular nested array to the next components
//
// Also takes in the location's ID and retrieves the location's
// inforamtion from the REDUX store
export default function ForecastLocationComponent({ locationId, locationNestedForecastHistoryArray  }) {

  // Get the location object from the REDUX store
  const location = useSelector(
    store => store.forecastLocations.userForecastLocationList.find(
      locationObj => locationObj.id === Number(locationId)
    )
  )


  // Build the DOM elements
  return (
    <>
      <h3>
        <u>{location.station}</u><span className="history-station-name-title"> - {location.name}</span>
      </h3>
      <ul className="history-main-ul">
        {locationNestedForecastHistoryArray.map(locationDateForecastHistoryArray => (
          <ForecastDayComponent
            key={`${locationId}${locationDateForecastHistoryArray[0].forecast_for_date}`}
            locationDateForecastHistoryArray={locationDateForecastHistoryArray}
          />
        ))}
      </ul>
    </>
  )
}