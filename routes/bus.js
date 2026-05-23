const express = require('express')
const router  = express.Router()
const { getAllBuses } = require('../controllers/bus.controller')

router.get('/get-buses', getAllBuses);

module.exports = router