const db = require("../db/connection.js")

//GEt /api/get-route-data
const getAllRoutes = async (req, res)=>{
    try{
        const [rows] = await db.query(`
      SELECT
        r.route_id,
        r.route_name,
        s.stop_id,
        s.stop_name,
        s.latitude,
        s.longitude,
        rs.stop_order
      FROM route r
      LEFT JOIN route_stop rs ON r.route_id = rs.route_id
      LEFT JOIN stop s        ON rs.stop_id  = s.stop_id
      ORDER BY r.route_id ASC, rs.stop_order ASC
    `)

    const routeMap = new Map();

    rows.forEach(row =>{
        if(!routeMap.has(row.route_id)){
        routeMap.set(row.route_id, {
            route_id:   row.route_id,
            route_name: row.route_name,
            stops: []  
        })
        }

        if(row.stop_id){
            routeMap.get(row.route_id).stops.push({
          stop_id:    row.stop_id,
          stop_name:  row.stop_name,
          latitude:   row.latitude,
          longitude:  row.longitude,
          stop_order: row.stop_order
        })
        }
    })

    // Convert Map to a plain array for JSON response
    const routes = Array.from(routeMap.values())

    res.status(200).json({ success: true, data: routes })

    }catch(err){
        console.error('getAllRoutes error:', err.message)
        res.status(500).json({ success: false, message: 'Server error.' })
    }
}

//POST /api/add-route
const addRoute = async (req, res)=>{
    try{
        const {routeName, stopIds} = req.body;
    
        if (!routeName) {
          return res.status(400).json({ success: false, message: 'routeName is required.' })
        }
    
        if (!stopIds || !Array.isArray(stopIds) || stopIds.length === 0) {
          return res.status(400).json({ success: false, message: 'stopIds must be a non-empty array.' })
        }
    
        const conn = await db.getConnection()
        try{
            await conn.beginTransaction()
            // Step A — insert the route
          const [routeResult] = await conn.query(
            'INSERT INTO route (route_name) VALUES (?)',
            [routeName]
          )
          const newRouteId = routeResult.insertId
    
          // Step B — insert each stop into route_stop
          // stop_order = position in the array (1-based)
          for (let i = 0; i < stopIds.length; i++) {
            await conn.query(
              'INSERT INTO route_stop (route_id, stop_id, stop_order) VALUES (?, ?, ?)',
              [newRouteId, stopIds[i], i + 1]
            )
          }
    
          await conn.commit()
    
          res.status(201).json({
            success: true,
            message: 'Route added successfully.',
            routeId: newRouteId
          })
    
        }catch (innerErr) {
          // Something failed — rollback (undo everything)
          await conn.rollback()
          throw innerErr
        } finally {
          // Always release the connection back to the pool
          conn.release()
        }
    }catch (err) {
    console.error('addRoute error:', err.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }

}

// POST /api/routes/check-overlap
// Body: { stopIds: [4, 8, 20, 59] }

const checkRouteOverlap = async (req, res) => {
  try{
    const { stopIds} = req.body;

    if (!stopIds || !Array.isArray(stopIds) || stopIds.length === 0) {
      return res.status(400).json({ success: false, message: 'stopIds must be a non-empty array.' })
    }
    const [rows] = await db.query(`
      SELECT
        r.route_id,
        r.route_name,
        s.stop_id,
        s.stop_name
      FROM route_stop rs
      JOIN route r ON rs.route_id = rs.route_id
      JOIN stop  s ON rs.stop_id  = s.stop_id
      WHERE rs.stop_id IN (?)
      ORDER BY r.route_id ASC
    `, [stopIds])

    const overlapMap = new Map()

    rows.forEach(row => {
      if (!overlapMap.has(row.route_id)) {
        overlapMap.set(row.route_id, {
          route_id:     row.route_id,
          route_name:   row.route_name,
          sharedStops:  [],
          overlapCount: 0
        })
      }

      overlapMap.get(row.route_id).sharedStops.push(row.stop_name)
      overlapMap.get(row.route_id).overlapCount++
    })

    const overlappingRoutes = Array.from(overlapMap.values())

    if (overlappingRoutes.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No overlap found. This route is unique.',
        overlappingRoutes: []
      })
    }

    // Sort by most overlap first
    overlappingRoutes.sort((a, b) => b.overlapCount - a.overlapCount)

    res.status(200).json({
      success: true,
      message: `Found ${overlappingRoutes.length} overlapping route(s).`,
      overlappingRoutes
    })
    } catch (err) {
    console.error('checkRouteOverlap error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAllRoutes, addRoute, checkRouteOverlap }