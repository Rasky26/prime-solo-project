// Import the forecase libraries and functions
import { useSelector } from "react-redux"

// Import the used components
import ForecastFormsContainer from "../Forecasts/ForecastFormsContainer"
import HomePageNavigateToLocations from "./HomePageNavigateToLocations"


// Component that displays when the user is not logged in.
// Links the user to the `Login` or `Registration` pages.
export default function HomePageLoggedIn() {

  // Check if the user has locations to forecast for
  const hasForecastLocations = useSelector(store => store.forecastLocations.userForecastLocationList.length)

  console.log(hasForecastLocations)

  // Build the DOM elements
  return (
    <>
      {hasForecastLocations ?
        <ForecastFormsContainer />
        :
        <HomePageNavigateToLocations />
      }
    </>
  )
}