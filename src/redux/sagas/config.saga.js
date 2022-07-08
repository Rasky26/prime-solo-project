// Import the core libraries and functions
import axios from "axios"
import { put, takeLatest } from "redux-saga/effects"


// Function that handles getting the static config
// file form the server
function* getConfigFile() {

  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }

    // the config includes credentials which
    // allow the server session to recognize the user
    // when the server recognizes the user session
    // it will end the session
    const configData = yield axios.get('/api/config', config)

    // Dispatch to the REDUX store the various fields
    // that were contained in the static config file.
    //
    // The forecast field limits for validation
    yield put({
      type: 'SET_FORECAST_FIELD_LIMITS',
      payload: configData.data.FORECAST_FIELD_LIMITS,
    })
    // The sky cover fields
    yield put({
      type: "SET_CLOUD_COVER_ARRAY",
      payload: configData.data.CLOUD_COVER_FIELDS,
    })
    // The wind direction fields
    yield put({
      type: "SET_WIND_DIRECTION_ARRAY",
      payload: configData.data.WIND_DIRECTION_FIELDS,
    })


  } catch (err) {
    console.log(`Error with config GET: ${err}`)
  }
}


// Get the config file from the server
function* configSaga() {
  yield takeLatest("GET_CONFIG_FILE", getConfigFile)
}


export default configSaga