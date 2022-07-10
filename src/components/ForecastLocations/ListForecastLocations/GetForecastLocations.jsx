// Import the core libraries and functions
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

// Import the used components
import ListForecastLocations from "./ListForecastLocations"


// Component that shows the user's tracked forecast
// locations and allows them to manage adding or removing
// various forecast locations from their account
export default function GetForecastLocations() {

  // Initialize the dispatch function
  const dispatch = useDispatch()

  // Get the user's current list of forecast locations
  useEffect(() => {
    dispatch({
      type: "GET_USER_FORECAST_LOCATION_LIST"
    })
  }, [])

  const userForecastLocations = useSelector(store => store.userForecastLocations.userForecastLocationList)

  console.log(">>>>>>>>>>>.", userForecastLocations)


  // Build the DOM elements
  return (
    <section>

      {(userForecastLocations) ?
        <ul>
          {userForecastLocations.map(location => (
            <ListForecastLocations key={location.id} location={location} />
          ))}
        </ul>
        :
        null
      }
    </section>
  )
}