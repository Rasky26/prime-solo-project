// Import the core libraries and functions
import axios from "axios"
import { put, takeLatest } from "redux-saga/effects"


// Function that sends the user's forecast to the database
// to be saved
function* saveForecastToDatabase(action) {

  console.log(">>>>>>>>>", action)

  // Build the headers to send along with the server request
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }

    // Send the POST request to the server
    yield axios.post("/api/forecast-creation", action.payload, config)


    // Update the user"s forecast history in the REDUX store
    yield put({
      type: "GET_USER_FORECAST_HISTORY",
    })

  // If errors occur, log them to the console
  } catch (err) {
    console.log(`Error with saveForecastToDatabase POST: ${err}`)
  }
}


// Listener for REDUX actions
function* forecastCreation() {
    yield takeLatest("SAVE_NEW_FORECAST_TO_DATABASE", saveForecastToDatabase)
}

export default forecastCreation