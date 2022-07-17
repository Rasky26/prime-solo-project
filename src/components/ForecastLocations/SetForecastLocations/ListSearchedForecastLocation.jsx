// Import the core libraries and functions
import { useDispatch } from "react-redux"

// Component that displays the search results from the list
// of available stations in the database. Allows users to
// add stations to their tracked list
export default function ListSearchedForecastLocation({ searchItem }) {

  // Initialize the dispatch function
  const dispatch = useDispatch()

  // Function that dispatches the selected station
  // and adds it to the user's tracked list of weather stations
  const setStationToUserList = () => {
    dispatch({
      type: "ADD_STATION_TO_USER_STATION_LIST",
      payload: {
        stationId: searchItem.id
      },
    })
  }

  return (
    <div className="location-name">
      <button type="button" onClick={setStationToUserList}>Add</button>
      <p className="location-station">{searchItem.station}</p>
      <p className="location-description">{searchItem.name} - {searchItem.state}</p>
    </div>
  )
}