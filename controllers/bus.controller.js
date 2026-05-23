const db = require("../db/connection.js")

// GET /api/get-bus-data
const getAllBuses = async (req, res)=>{
    try{
        const [buses] = await db.query(`
            SELECT
            b.bus_id,
            b.registration_number,
            b.capacity,
            b.status,
            d.name     AS depot_name,
            d.location AS depot_location
            FROM bus b
            LEFT JOIN depot d ON b.depot_id = d.depot_id
            ORDER BY b.bus_id ASC
            `)
            res.status(200).json({ success: true, data: buses })
    }catch(err){
        console.error('getAllBuses error:', err.message)
        res.status(500).json({ success: false, message: 'Server error.' })
    }
}
module.exports = {
    getAllBuses
}