const express = require('express')
const router  = express.Router()
const {
  getCrewReport,
  getBusReport,
  getDutyTypeReport,
  getDailyReport,
  getRouteReport
} = require('../controllers/report.controller')

router.get('/reports/crew',       getCrewReport)
router.get('/reports/bus',        getBusReport)
router.get('/reports/duty-type',  getDutyTypeReport)
router.get('/reports/daily',      getDailyReport)
router.get('/reports/route',      getRouteReport)

module.exports = router