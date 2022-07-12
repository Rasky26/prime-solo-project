// Import the core libraries and functions
import axios from "axios"
import { put, takeLatest } from "redux-saga/effects"


// Function that gets a list of the recent forecasts
// from the current user from the last two weeks
function* getUserForecastHistory() {

  console.log("In getUserForecastHistory")

  // Build the headers to send along with the server request
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }

    // Send the GET request to the server
    const forecastHistory = yield axios.get('/api/forecast-history', config)

    // Update the user's station list
    yield put({
      type: 'SET_USER_FORECAST_HISTORY',
      payload: forecastHistory.data,
    })

  // If errors occur, log them to the console
  } catch (err) {
    console.log(`Error with getUserForecastHistory GET: ${err}`)
  }
}


// Get the user's forecast location array from the server
function* userForecastHistory() {
  yield takeLatest("GET_USER_FORECAST_HISTORY", getUserForecastHistory)
}


export default userForecastHistory