// Import the core libraries and functions
const express = require('express')
const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const encryptLib = require('../modules/encryption')
const pool = require('../modules/pool')
const userStrategy = require('../strategies/user.strategy')

// Import the static config file
const configFile = require('../constants/configs.json')


// Main router element to make requests to
const router = express.Router()


// Base route to get the JSON config file
router.get("/", rejectUnauthenticated, (req, res) => {
  res.send(configFile)  
})


module.exports = router