// SET_USER_FORECAST_LOCATION_LIST

// Import the used libraries and functions
import { combineReducers } from "redux"


// Reducer to store the various forecasting locations
// the user has set to track
const userForecastLocationList = (state = [], action) => {

  switch (action.type) {
    case "SET_USER_FORECAST_LOCATION_LIST":
      return action.payload
    default:
      return state
  }
}


// Export the various STATE values set above
export default combineReducers({ 
  userForecastLocationList, // List of all tracked forecast stations
})