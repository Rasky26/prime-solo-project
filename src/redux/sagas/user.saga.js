import axios from 'axios'
import { put, takeLatest } from 'redux-saga/effects'

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user', config)

    // now that the session has given us a user object
    // with an id and email set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data })

    // Get the config JSON file and set to STATE
    yield put({ type: "GET_CONFIG_FILE" })

    // Get the user's saved forecast location
    yield put({ type: "GET_USER_FORECAST_LOCATION_LIST" })

    // Get the user's forecast history
    yield put({ type: "GET_USER_FORECAST_HISTORY" })

  } catch (error) {
    console.log(`User get request failed: ${error}`)
    // console.log("SUPER STRETCH --> Make DB to capture failed login attempts")
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser)
}

export default userSaga
