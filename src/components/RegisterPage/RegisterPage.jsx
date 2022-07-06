// Import the used libraries and functions
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// Import the used components
import RegisterForm from '../RegisterForm/RegisterForm'


// Component that handles the registration display
export default function RegisterPage() {

  // Get the current errors from REDUX state
  const errors = useSelector(store => store.errors)

  // Build the DOM element
  return (
    <div>
  
      {errors.registrationMessage ?
        <p className='error-field'>{errors.registrationMessage}</p>
        :
        null
      }

      <RegisterForm />
      
      <Link to="/login">Login</Link>
    </div>
  )
}