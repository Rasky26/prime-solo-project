// Import the used libraries and functions
import { useDispatch, useSelector } from "react-redux"

// Component that builds the list of user
// forecast locations
export default function ListForecastLocations({ location }) {

  // Initialize the dispatch function
  const dispatch = useDispatch()
  // Get the user from the store
  const user = useSelector(store => store.user)

  // Set all the location-based values as number values
  const latitude = Number(location.latitude)
  const longitude = Number(location.longitude)
  const elevation = Number(location.elevation)

  // Function that removes a station from a user's list
  const removeStationFromFavorites = () => {

    // Send the command to remove the location from the
    // user's forecast location on the DB
    dispatch({
      type: "REMOVE_USER_FORECAST_STATION",
      payload: {
        locationId: location.id,
      }
    })
  }

    
  // Return the list DOM element
  return (
    <li>
      <div>
        {location.station}
      </div>
      <div>
        <span>{location.name}</span> - <span>{location.state}</span>
      </div>
      <div>Lat: <span>{latitude}</span> Long: <span>{longitude}</span> Ele: <span>{elevation}</span></div>
      <button type="button" onClick={removeStationFromFavorites}>X</button>
    </li>
  )
}