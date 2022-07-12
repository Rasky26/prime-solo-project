// Import the used components
import ForecastFormsContainer from "../Forecasts/ForecastFormsContainer"


// Component that displays when the user is not logged in.
// Links the user to the `Login` or `Registration` pages.
export default function HomePageLoggedIn() {

  // Build the DOM elements
  return (
    <>
      <ForecastFormsContainer />
    </>
  )
}