// Import the used libraries and functions
import { combineReducers } from "redux"


// Reducer to store the array of sky cover objects
const cloudCover = (state = [], action) => {
  switch (action.type) {
    case "SET_CLOUD_COVER_ARRAY":
      return action.payload
    default:
      return state
  }
}


// Reducer to store the various forecasting field
// limits. These are mainly used in validation
const forecastFieldLimits = (state = {}, action) => {
  switch (action.type) {
    case "SET_FORECAST_FIELD_LIMITS":
      return action.payload
    default:
      return state
  }
}


// Reducer to store the array of wind directions
const windDirection = (state = [], action) => {
  switch (action.type) {
    case "SET_WIND_DIRECTION_ARRAY":
      return action.payload
    default:
      return state
  }
}


// Export the various STATE values set above
export default combineReducers({
  cloudCover,  
  forecastFieldLimits,
  windDirection,
})