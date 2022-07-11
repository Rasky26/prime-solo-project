// Import the core libraries and functions
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


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

  console.log(">>>>>>>>>>", userForecastHistory)

  // Build the DOM elements
  return (
    <>HISTORY!</>
  )
}