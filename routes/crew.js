const express = require('express')
const router  = express.Router()
const { getAllCrew } = require('../controllers/crew.controller')

router.get('/get-crew-data', getAllCrew)

module.exports = router