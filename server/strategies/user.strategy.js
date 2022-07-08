// Import core libraries and functions
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const encryptLib = require('../modules/encryption')
const pool = require('../modules/pool')


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {

  // Query returns BOTH the user AND user_settings
  const sqlQuery = `
    SELECT *
    FROM "user"
    JOIN "user_settings"
      ON "user".id = user_settings.user_id
    WHERE "user".id = $1
  `

  // Query the database
  pool.query(sqlQuery, [id])
  // .query('SELECT * FROM "user" WHERE id = $1', [id])
  .then((result) => {
    // Handle Errors
    const user = result && result.rows && result.rows[0]

    if (user) {

      // User is found, remove unnecessary fields
      delete user.password // remove password so it doesn't get sent
      delete user.user_id   // Redundant to the current ID, safe to delete as well
      // done takes an error (null in this case) and a user
      done(null, user)
    } else {
      // User was not found
      // done takes an error (null in this case) and a user (also null in this case)
      // this will result in the server returning a 401 status code
      done(null, null)
    }
  })
  .catch((error) => {
    console.log('Error with query during deserializing user ', error)
    // done takes an error (we have one) and a user (null in this case)
    // this will result in the server returning a 500 status code
    done(error, null)
  })
})

// Does actual work of logging in
passport.use(
  'local',
  new LocalStrategy((email, password, done) => {
    pool
      .query('SELECT * FROM "user" WHERE email = $1', [email])
      .then((result) => {
        const user = result && result.rows && result.rows[0];
        if (user && encryptLib.comparePassword(password, user.password)) {
          // All good! Passwords match!
          // done takes an error (null in this case) and a user
          done(null, user);
        } else {
          // Not good! Email and password do not match.
          // done takes an error (null in this case) and a user (also null in this case)
          // this will result in the server returning a 401 status code
          done(null, null);
        }
      })
      .catch((error) => {
        console.log('Error with query for user ', error);
        // done takes an error (we have one) and a user (null in this case)
        // this will result in the server returning a 500 status code
        done(error, null);
      });
  })
);

module.exports = passport;
