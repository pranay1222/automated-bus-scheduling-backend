const db = require("../db/connection.js")

// GET /api/reports/crew
const getCrewReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.crew_id,
        c.name        AS crew_name,
        c.role,
        COUNT(*)      AS total_duties
      FROM duty d
      JOIN crew c ON d.driver_id = c.crew_id

      GROUP BY c.crew_id, c.name, c.role

      UNION ALL

      SELECT
        c.crew_id,
        c.name,
        c.role,
        COUNT(*)
      FROM duty d
      JOIN crew c ON d.conductor_id = c.crew_id
      GROUP BY c.crew_id, c.name, c.role

      ORDER BY total_duties DESC
    `)

    res.status(200).json({ success: true, data: rows })

  } catch (err) {
    console.error('getCrewReport error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/reports/bus
const getBusReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        b.bus_id,
        b.registration_number,
        b.status,
        d.name          AS depot_name,
        COUNT(*)        AS total_duties
      FROM duty dy
      JOIN bus   b ON dy.bus_id   = b.bus_id
      JOIN depot d ON b.depot_id  = d.depot_id
      GROUP BY b.bus_id, b.registration_number, b.status, d.name
      ORDER BY total_duties DESC
    `)

    res.status(200).json({ success: true, data: rows })

  } catch (err) {
    console.error('getBusReport error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/reports/duty-type

const getDutyTypeReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        duty_type,
        COUNT(*) AS total
      FROM duty
      GROUP BY duty_type
    `)
    res.status(200).json({ success: true, data: rows })

  } catch (err) {
    console.error('getDutyTypeReport error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/reports/daily

const getDailyReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.schedule_date,
        COUNT(*)  AS total_duties,
        SUM(CASE WHEN d.duty_type = 'Linked'   THEN 1 ELSE 0 END) AS linked_duties,
        SUM(CASE WHEN d.duty_type = 'Unlinked' THEN 1 ELSE 0 END) AS unlinked_duties
      FROM duty d
      JOIN schedule s ON d.schedule_id = s.schedule_id
      GROUP BY s.schedule_date
      ORDER BY s.schedule_date ASC
    `)
     res.status(200).json({ success: true, data: rows })

  } catch (err) {
    console.error('getDailyReport error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/reports/route

const getRouteReport = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.route_id,
        r.route_name,
        COUNT(*) AS total_duties
      FROM duty d
      JOIN route r ON d.route_id = r.route_id
      GROUP BY r.route_id, r.route_name
      ORDER BY total_duties DESC
    `)

    res.status(200).json({ success: true, data: rows })

  } catch (err) {
    console.error('getRouteReport error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getCrewReport,
  getBusReport,
  getDutyTypeReport,
  getDailyReport,
  getRouteReport
}