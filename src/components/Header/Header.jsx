// Import `useSelector` to access the REDUX store
import { useSelector } from "react-redux"

// Import used components
import LogOutButton from "../LogOutButton/LogOutButton"

// Component that renders the `Header` on every page of the App
export default function Header() {

  // Get the current user, if one is logged in
  const user = useSelector(store => store.user)

  // Build the DOM elements
  return (
    <header>
        <h1>Met Helper</h1>

    {user.id ?
      <div className='logout-button-container'>
        <LogOutButton />
      </div>
      :
      null
    }

    </header>
  )
}