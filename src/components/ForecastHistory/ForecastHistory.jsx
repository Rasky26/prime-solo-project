// Import the core libraries and functions
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

// Import the used components
import ForecastDayComponent from "./ForecastDayComponent"


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

  // Generate a list of unique forecast_for_dates since
  // several forecasts can all exist for the same date.
  const uniqueDates = [...new Set(userForecastHistory.map(historyDate => historyDate.forecast_for_date))]

  // Create nested arrays where each `forecast_for_date` is
  // grouped together in the nested array. This will allow
  // for easier iteration over the main array to display the
  // various forecasts to the DOM
  //
  // Loop over the unique dates
  const nestedForecastHistoryArray = uniqueDates.map(
    // Put matching dates into their own array...
    date => userForecastHistory.filter(
      // ...where the matching date matches the unique filter date
      historyDate => historyDate.forecast_for_date === date
    )
  )


  // Build the DOM elements by sending one day's array filled with forecast
  // history objects. Each day will be processed within the top-level
  // `<ul>` element.
  return (
    <section>
      <ul>
        {nestedForecastHistoryArray.map(forecastHistoryArray => 
          <ForecastDayComponent
            key={forecastHistoryArray[0].forecast_for_date}
            forecastHistoryArray={forecastHistoryArray}
          />
        )}
      </ul>
    </section>
  )
}