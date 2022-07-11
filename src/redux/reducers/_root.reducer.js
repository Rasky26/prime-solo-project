// Import the core libraries and functions
import { combineReducers } from "redux"

// Import the used reducers
import config from "./config.reducer"
import errors from "./errors.reducer"
import forecastHistory from "./forecastHistory.reducer"
import forecastLocations from "./forecastLocations.reducer"
import user from "./user.reducer"


// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga
const rootReducer = combineReducers({
  config,                // contains several static objects from a config file
  errors,                // contains registrationMessage and loginMessage
  forecastHistory,       // information showing the recent user's forecast history
  forecastLocations,     // information related to the user's forecast locations
  user,                  // will have an id and email if someone is logged in
});


// Make the redux STATE's available to the App
export default rootReducer