const express = require('express')
const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const encryptLib = require('../modules/encryption')
const pool = require('../modules/pool')
const userStrategy = require('../strategies/user.strategy')

// Main router element to make requests to
const router = express.Router()


// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user)
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {

  // The email is passed as 'username' to account for the
  // node_module `passport_local` check for that specific
  // value to automate login.
  const email = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password)

  const sqlQuery = `
    INSERT INTO "user"
      (email, password)
    VALUES 
      ($1, $2)
    RETURNING id`

  const sqlParams = [email, password]

  // Outer POOL query
  pool.query(sqlQuery, sqlParams)
  // Make the query to create a new user
  .then((result) => {

      // Inner POOL query
      //
      // Build the "user_settings" query
      const sqlQueryUserSettings = `
        INSERT INTO "user_settings"
          ("user_id")
        VALUES
          ($1)
      `
      // Set the "user_id" param
      const sqlParamUserSettings = [
        result.rows[0].id,
      ]

      // Check if a data was returned
      if (result.rows) {
        // Send the query to create a new user_setting
        /// based on the user.id value
        pool.query(sqlQueryUserSettings, sqlParamUserSettings)
        // No action needed if the "user_settings" row was created
        .then(() => {

        })
        // Catch any errors from the "user_settings" creation
        .catch((err) => {
          console.log(`User settings failed with ${err}`)
          res.sendStatus(500)
        })
        // END of inner POOL query
      }
    
      res.sendStatus(201)
    })
  // Catch errors on the main user creation section
  .catch((err) => {
    console.log(`User registration failed with ${err}`)
    res.sendStatus(500)
  })
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200)
})

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout()
  res.sendStatus(200)
});

module.exports = router
