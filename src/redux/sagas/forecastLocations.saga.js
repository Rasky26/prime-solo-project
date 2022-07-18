// Import the core libraries and functions
import axios from "axios"
import { put, takeLatest } from "redux-saga/effects"


// Function that adds a station to the user's tracked
// list
function* addStationToUserStationList(action) {

  // Build the headers to send along with the server request
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }

    // Send the POST request to the server
    yield axios.post('/api/forecast-locations/add-station', action.payload, config)


    // Update the user's station list
    yield put({
      type: 'GET_USER_FORECAST_LOCATION_LIST',
    })

  // If errors occur, log them to the console
  } catch (err) {
    console.log(`Error with addStationToUserStationList POST: ${err}`)
  }
}

// Function that handles getting the user's tracked
// locations form the server
function* getUserForecastLocationList() {

  // Build the headers to send along with the server request
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }

    // the config includes credentials which
    // allow the server session to recognize the user
    // when the server recognizes the user session
    // it will end the session
    const forecastLocations = yield axios.get('/api/forecast-locations', config)


    // Set the current user's forecast locations to REDUX
    yield put({
      type: 'SET_USER_FORECAST_LOCATION_LIST',
      payload: forecastLocations.data,
    })

  // If errors occur, log them to the console
  } catch (err) {
    console.log(`Error with getUserForecastLocationList GET: ${err}`)
  }
}

// Function that removes the specified station from the
// user's stored location DB table
function* removeUserForecastLocation(action) {

  // Build the headers to send along with the server request
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }

    // Call the route to remove the specified location from the user's
    // table
    yield axios.delete(`/api/forecast-locations/${action.payload.locationId}`, config)


    // Set the current user's forecast locations to REDUX
    yield put({
      type: 'GET_USER_FORECAST_LOCATION_LIST'
    })

  // If errors occur, log them to the console
  } catch (err) {
    console.log(`Error with removeUserForecastLocation DELETE: ${err}`)
  }
}


// Get the user's forecast location array from the server
function* userForecastLocations() {
  yield takeLatest("ADD_STATION_TO_USER_STATION_LIST", addStationToUserStationList)
  yield takeLatest("GET_USER_FORECAST_LOCATION_LIST", getUserForecastLocationList)
  yield takeLatest("REMOVE_USER_FORECAST_STATION", removeUserForecastLocation)
}


export default userForecastLocations