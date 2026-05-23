const express = require('express')
const router  = express.Router()

const { CreateDuty, getAllDuties, getDutiesByDate } = require('../controllers/duty.controller')

router.post('/create-duty',       CreateDuty)
router.get('/get-duties',         getAllDuties)
router.get('/get-duties-by-date', getDutiesByDate)

module.exports = router
//export the router to be used in the main app.js file