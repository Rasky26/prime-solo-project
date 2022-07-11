// Import the used libraries and functions
import { combineReducers } from "redux"


// Reducer to store the various forecasts made by the
// user over the past two weeks
const userForecastHistory = (state = [], action) => {

  switch (action.type) {
    case "SET_USER_FORECAST_HISTORY":
      return action.payload
    case "UNSET_USER":
      return []
    default:
      return state
  }
}


// Export the various STATE values set above
export default combineReducers({ 
    userForecastHistory, // List of all user forecasts from the past two weeks
})