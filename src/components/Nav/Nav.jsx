// Import the used library functions & components
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Component that handles the construction and display of the side
// <Nav> bar.
export default function Nav() {

  const user = useSelector(store => store.user)

  // Initilize the number of forecasts that are
  // pending to be created for the day.
  // const user = useSelector((store) => store.user);

  return (
    <nav>

      {user.id ?
        <Link className="nav-link" to="/forecast">
          Forecast
        </Link>
        :
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