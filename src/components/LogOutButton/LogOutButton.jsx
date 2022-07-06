// Import used functions / libraries
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';


// Component that handles displaying and the logic behind the
// the logout button
export default function LogOutButton(props) {

  // Initialize the dispatch function
  const dispatch = useDispatch()
  // Initialize the history function
  const history = useHistory()

  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className={props.className}
      onClick={() => {
        dispatch({ type: 'LOGOUT' })
      
      // Send the user back to the homepage
        history.push("/")
      }}

    >
      Log Out
    </button>
  )
}