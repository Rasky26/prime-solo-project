// Import the core libraries and functions
import { Link } from "react-router-dom"

// Component that shows information on the homepage when
// a logged in user has zero locations selected
export default function HomePageNavigateToLocations() {


  // Build the DOM elements
  return (
    <div>
      <h3>Let's build out your weather network!</h3>
      <Link to="/locations">Add Locations!</Link>
    </div>
  )
}