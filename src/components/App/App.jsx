// Import the core libraries 
import { useEffect } from "react"
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

// Import the `ProtectedRoutes` component to restrict access behind login
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"

// Import the used components
import Footer from "../Footer/Footer"
import ForecastHistory from "../ForecastHistory/ForecastHistory"
import ForecastLocations from "../ForecastLocations/ForecastLocations"
import Header from "../Header/Header"
import HomePageLoggedIn from "../HomePage/HomePageLoggedIn"
import HomePageNotLoggedIn from "../HomePage/HomePageNotLoggedIn"
import LoginPage from "../LoginPage/LoginPage"
import Nav from "../Nav/Nav"
import RegisterPage from "../RegisterPage/RegisterPage"

// Import the main stylesheet
import "./App.css"


// Core component of our App. All views are
// controlled via this location and components
// are rendered based on selected routes
export default function App() {

  // Initialize the dispatch function
  const dispatch = useDispatch()
  // Get the user field. Updates with STATE changes
  const user = useSelector(store => store.user)
  // Initialize the user object, and track the STATE
  // with changes to update that object as necessary
  useEffect(() => {

    // Fetch the current logged in user"s information
    dispatch({ type: "FETCH_USER" })

    // Upon login, get the config file from the server
    dispatch({ type: "GET_CONFIG_FILE" })

  }, [dispatch])

  return (
    <Router>

      <Header />

      <Nav />

      <main>
      
        <Switch>

          <Route path="/login" exact>
            {user.id ?
              // If the user is already logged in, redirect to the /user page
              <Redirect to="/" />
              :
              // Otherwise, show the login page
              <LoginPage />
            }
          </Route>

          <Route path="/registration" exact>
            {user.id ?
              // If the user is already logged in, redirect them to the /user page
              <Redirect to="/" />
              :
              // Otherwise, show the registration page
              <RegisterPage />
            }
          </Route>

          <Route path="/" exact>
            {user.id ?
              // If the user is already logged in, redirect them to the /user page
              <HomePageLoggedIn />
              :
              // Otherwise, show the Landing page
              <HomePageNotLoggedIn />
            }
          </Route>

          <ProtectedRoute path="/locations" exact>
            <ForecastLocations />
          </ProtectedRoute>

          <ProtectedRoute path="/history" exact>
            <ForecastHistory />
          </ProtectedRoute>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>

        </Switch>

      </main>

      <Footer />

    </Router>
  )
}