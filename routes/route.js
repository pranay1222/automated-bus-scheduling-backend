const express = require('express')
const router  = express.Router()
const { getAllRoutes, addRoute, checkRouteOverlap } = require('../controllers/route.controller')

router.get('/get-routes', getAllRoutes)
router.post('/add-route', addRoute)
router.post('/routes/check-overlap', checkRouteOverlap) // New endpoint for checking route overlap

module.exports = router