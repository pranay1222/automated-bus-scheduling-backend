const db = require("../db/connection.js")
const { createLinkedDuty, createUnlinkedDuty } = require("../helper/scheduling.js")

// POST /api/create-duty
const CreateDuty = async (req, res) => {
  try {
    const { busId, driverId, conductorId, startTime, endTime, dutyType, scheduleId, shift, routeId } = req.body

    if (!busId || !driverId || !conductorId || !startTime || !endTime || !dutyType || !scheduleId || !shift || !routeId) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if (startTime >= endTime) {
      return res.status(400).json({ success: false, message: "Start time must be before end time" })
    }

    if (dutyType !== "Linked" && dutyType !== "Unlinked") {
      return res.status(400).json({ success: false, message: "Duty type must be 'Linked' or 'Unlinked'" })
    }

    const data = { busId, driverId, conductorId, startTime, endTime, scheduleId, shift, routeId }

    const result = dutyType === "Linked"
      ? await createLinkedDuty(data)
      : await createUnlinkedDuty(data)

    if (result.success) {
      return res.status(201).json({ success: true, message: result.message, dutyId: result.dutyId })
    } else {
      return res.status(409).json({ success: false, message: result.message })
    }

  } catch (err) {
    console.error('createDuty error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/get-duties
const getAllDuties = async (req, res) => {
  try {
    const [duties] = await db.query(`
      SELECT
        d.duty_id,
        d.duty_type,
        d.start_time,
        d.end_time,
        d.shift,
        d.schedule_id,
        bus.registration_number AS bus_registration_number,
        driver.name             AS driver_name,
        conductor.name          AS conductor_name,
        d.route_id,
        s.schedule_date
      FROM duty d
      JOIN crew     driver    ON d.driver_id    = driver.crew_id
      JOIN crew     conductor ON d.conductor_id = conductor.crew_id
      JOIN bus                ON d.bus_id       = bus.bus_id
      JOIN route              ON d.route_id     = route.route_id
      JOIN schedule s         ON d.schedule_id  = s.schedule_id
      ORDER BY s.schedule_date, d.start_time
    `)

    res.status(200).json({ success: true, data: duties })

  } catch (err) {
    console.error('getAllDuties error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/get-duties-by-date?date=2026-03-20
const getDutiesByDate = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ success: false, message: "Query parameter 'date' is required" })
    }

    const [duties] = await db.query(`
      SELECT
        d.duty_id,
        d.duty_type,
        d.start_time,
        d.end_time,
        d.shift,
        bus.registration_number AS bus_registration_number,
        driver.name             AS driver_name,
        conductor.name          AS conductor_name,
        d.route_id
      FROM duty d
      JOIN crew     driver    ON d.driver_id    = driver.crew_id
      JOIN crew     conductor ON d.conductor_id = conductor.crew_id
      JOIN bus                ON d.bus_id       = bus.bus_id
      JOIN route              ON d.route_id     = route.route_id
      JOIN schedule s         ON d.schedule_id  = s.schedule_id
      WHERE s.schedule_date = ?
      ORDER BY d.start_time
    `, [date])

    res.status(200).json({ success: true, data: duties })

  } catch (err) {
    console.error('getDutiesByDate error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  CreateDuty,
  getAllDuties,
  getDutiesByDate
}