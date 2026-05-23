const db = require("../db/connection.js")

// GET /api/get-crew-data
const getAllCrew = async (req, res)=>{
    try{
        const {role} = req.query;

        let query = `SELECT * FROM crew`;
        let params = [];

        if(role){
            query += ` WHERE role = ?`;
            params = [role];
        }

        query += ` ORDER BY name ASC`

        const [crew] = await db.query(query, params);

        res.status(200).json({ success: true, data: crew })
    }catch(err){
        console.error('getAllCrew error:', err.message)
        res.status(500).json({ success: false, message: 'Server error.' })
    }
}

module.exports = {
    getAllCrew
}