// Import the used library functions & components
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


// Component that handles the construction and display of the side
// <Nav> bar.
export default function Nav() {

  // Get the current use from the REDUX store
  const user = useSelector(store => store.user)

  // Initilize the number of forecasts that are
  // pending to be created for the day.
  // const user = useSelector((store) => store.user);

  // Build the DOM elements for the side navigation bar
  return (
    <nav>

      {user.id ?
        // If the user is logged in, allow them to navigate to the forecast section
        <Link className="nav-link" to="/forecast">
          Forecast
        </Link>
        :
        // Otherwise, allow users to navigate to the homepage.
        <Link to="/">
          Home
        </Link>
      }

      <Link className="nav-link" to="/locations">
        Locations
      </Link>

      <Link className="nav-link" to="/history">
        History
      </Link>

    </nav>
  )
}