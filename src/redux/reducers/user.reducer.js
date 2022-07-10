// Reducer that handles setting or removing the user's
// information from the redux STORE
const userReducer = (state = {}, action) => {

  switch (action.type) {
    // Store the user information in REDUX
    case "SET_USER":
      return action.payload
    // Remove the user information from REDUX
    case "UNSET_USER":
      return {}
    default:
      return state
  }
}

// user will be on the redux state at:
// state.user
export default userReducer
