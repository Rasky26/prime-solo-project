// Import the core libraries and functions
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

// Import the used components
import ForecastLocationComponent from "./ForecastHistoryLogic/ForecastLocationComponent"

// Import the functionality to restructure the forecast
// history array
import reshapeUserForecastHistory from "./Utils/reshapeUserForecastHistory"

// Component that shows the forecast history of the
// specific user
export default function ForecastHistory() {

  // Initialize the dispatch function
  const dispatch = useDispatch()

  // Get the forecast history to the REDUX store
  // on load
  useEffect(() => {
    dispatch({
      type: "GET_USER_FORECAST_HISTORY"
    })
  }, [])

  // Get the current user's forecast history
  const userForecastHistory = useSelector(store => store.forecastHistory.userForecastHistory)
  // Get the locations from REDUX store
  const userLocationIdArray = useSelector(store => store.forecastLocations.userForecastLocationList.map(
    forecastLocation => forecastLocation.id
  ))

  // Use the utility function to take our flat forecast
  // history array and restructure it to categorize the
  // forecasts based on location and group forecasts
  // based on their `forecast_for_date`
  const structuredForecastHistory = reshapeUserForecastHistory(userForecastHistory)

  // Get an array of the location ID keys
  const locationIds = Object.keys(structuredForecastHistory)

  

  // Build the DOM elements by sending one location's array
  // filled with forecast history nested array for that location.
  //
  //  {"1236": [[...], [...], ..., [...]],
  //   "1191": [[...], [...], ..., [...]],}
  return (
    <section>
      {locationIds.map(locationId =>

        <ForecastLocationComponent
          key={Number(locationId)}
          locationId={Number(locationId)}
          locationNestedForecastHistoryArray={structuredForecastHistory[locationId]}
        />

      )}
    </section>
  )
}