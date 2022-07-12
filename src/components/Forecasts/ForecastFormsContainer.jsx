// Import the core libraries and functions
import { useState } from "react"
import { useSelector } from "react-redux"

// Import the used components
import ForecastFormForDates from "./ForecastForms/ForecastFormForDates"
import LocationSelection from "./LocationSelection/LocationSelection"


// Component that handles the display of the forecast
// form cards for all days of the allowed forecast
export default function ForecastFormsContainer() {

  // Initialize the current tracked station, can pass into
  // nested ForecastForm component as a prop
  const [currentStationId, setCurrentStationId] = useState('')

  // Get the user's tracked forecast locations from
  // the REDUX store
  const locations = useSelector(store => store.forecastLocations.userForecastLocationList)

  // Listener to handle when a location button is selected
  // and update the local state to reflect that value
  const onSelectLocation = (locationId) => {
    setCurrentStationId(locationId)
  }

  // Build the DOM elements
  return (
    <section>

      <LocationSelection
        locations={locations}
        onSelectLocation={onSelectLocation}
      />

      {(currentStationId) ?
        <ForecastFormForDates 
          locationId={currentStationId}
        />
        :
        null
      }

    </section>
  )
}