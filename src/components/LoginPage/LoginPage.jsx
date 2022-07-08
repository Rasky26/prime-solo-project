// Import the core libraries and functions
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

// Import the used components
import LoginForm from '../LoginForm/LoginForm'


// Component that builds the login form on the screen.
// Also provides links to the registration page.
export default function LoginPage() {

  // Get the current errors from REDUX state
  const errors = useSelector(store => store.errors)

  // Build the Login page
  return (
    <div>

      {errors.loginMessage ?
        <p className='error-field'>{errors.loginMessage}</p>
        :
        null
      }

      <LoginForm />
      
      <Link to="/registration">Register</Link>
    </div>
  )
}