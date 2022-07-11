// Import the core libraries and functions
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

// Import the used components
import DisplayForecastHistory from "./DisplayForecastHistory"
import NestedForecastHistory from "./NestedForecastHistory"


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

  nestedForecastHistoryArray.map(forecastDateArray => {
    console.log(forecastDateArray[0])
  })


  // Build the DOM elements
  return (
    <section>
      <ul>
        {nestedForecastHistoryArray.map(forecastDateArr => {
          // Split off the first element, but retain the others
          let [first, ...others] = forecastDateArr

          // Build the DOM elements from that separated list
          return (
          <>
            <DisplayForecastHistory
              key={first.id}
              forecastHistoryObj={first}  
            />
            <NestedForecastHistory
              forecastHistoryArray={others}
            />
          </>
          )
        })}
      </ul>
    </section>
  )
}