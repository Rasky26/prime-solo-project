// Import the core functions and libraries
import { all } from "redux-saga/effects"

// Import the used saga files
import configSaga from "./config.saga"
import loginSaga from "./login.saga"
import registrationSaga from "./registration.saga"
import userForecastLocations from "./forecastLocations.saga"
import userSaga from "./user.saga"

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    configSaga(),
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userForecastLocations(),
    userSaga(),
  ])
}
