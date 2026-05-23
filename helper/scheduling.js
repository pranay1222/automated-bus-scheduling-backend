const db = require('../db/connection.js');

// Function to check if a bus is available for a given time slot
async function checkbusAvailability(busId, scheduleId, startTime, endTime) {
    try{
        const [rows] = await db.query(`
        SELECT * FROM duty
        WHERE bus_id = ?
        AND schedule_id = ?
        AND start_time <? AND end_time > ?
        `, [busId, scheduleId, endTime, startTime]);

        console.log('Bus availability check:', rows);
        return rows.length ===0; // If no overlapping duties, the bus is available

    }catch(error){
        console.error('Error checking bus availability:', error);
    }
}

// Function to check if a driver is available for a given time slot
async function checkDriverAvailability(driverId, scheduleId,startTime, endTime) {
    try{
        const [rows] = await db.query( `
        SELECT * FROM duty
        WHERE driver_id = ?
        AND schedule_id = ?
        AND start_time <? AND end_time > ?
        `,[driverId, scheduleId, endTime, startTime]);

        return rows.length ===0; // If no overlapping duties, the driver is available
    }catch(error){
        console.error('Error checking driver availability:', error);
    }
}

// Function to check if a conductor is available for a given time slot
async function checkConductorAvailability(conductorId, scheduleId, startTime, endTime) {
    try{
        const[rows] = await db.query(`
            SELECT * FROM duty
            WHERE conductor_id = ?
            AND schedule_id = ?
            AND start_time <? AND end_time > ?
        `,[conductorId, scheduleId, endTime, startTime]);

        return rows.length ===0; // If no overlapping duties, the conductor is available
    }catch(error){
        console.error('Error checking conductor availability:', error);
    }
}

//insert duty into the database
async function InsertDuty(dutyData){
    try{
        const [result] =await db.query(`
            INSERT INTO duty (duty_type, start_time, end_time, schedule_id, bus_id, driver_id, conductor_id, shift, route_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,[dutyData.dutyType, 
                dutyData.startTime, 
                dutyData.endTime, 
                dutyData.scheduleId, 
                dutyData.busId, 
                dutyData.driverId, 
                dutyData.conductorId, 
                dutyData.shift, 
                dutyData.routeId
            ]);
            
            return result.insertId; // Return the ID of the newly inserted duty
    }catch(error){
        console.error('Error inserting duty:', error);
    }
}

//Create LinkedDuty
async function createLinkedDuty(data){
    try{
        const busAvailable = await checkbusAvailability(data.busId, data.scheduleId, data.startTime, data.endTime);//-->return true if bus is available, false if not
        const driverAvailable = await checkDriverAvailability(data.driverId, data.scheduleId, data.startTime, data.endTime);//-->return true if driver is available, false if not
        const conductorAvailable = await checkConductorAvailability(data.conductorId, data.scheduleId, data.startTime, data.endTime);//-->return true if conductor is available, false if not

        if(!busAvailable){
            return { success: false, message: 'Bus is not available for the selected time slot.' };
        }
        if(!driverAvailable){
            return { success: false, message: 'Driver is not available for the selected time slot.' };
        }
        if(!conductorAvailable){
            return { success: false, message: 'Conductor is not available for the selected time slot.' };
        }

        const dutyId = await InsertDuty({ ...data, dutyType: 'LinkedDuty' });

        if(dutyId){
            return {success: true, message: 'Duty created successfully.', dutyId: dutyId};
        }
    }catch(error){
        console.error('Error creating linked duty:', error);
        return { success: false, message: 'An error occurred while creating the duty.' };
    }
}

//create UnlinkedDuty
async function createUnlinkedDuty(data){
    try{
        const busAvailable = await checkbusAvailability(data.busId, data.scheduleId, data.startTime, data.endTime);//-->return true if bus is available, false if not

        if(!busAvailable){
            return { success: false, message: 'Bus is not available for the selected time slot.' };
        }

        const dutyId = await InsertDuty({ ...data, dutyType: 'UnlinkedDuty' });

        if(dutyId){
            return {success: true, message: 'Duty created successfully.', dutyId: dutyId};
        }
    }catch(error){
        console.error('Error creating unlinked duty:', error);
        return { success: false, message: 'An error occurred while creating the duty.' };
    }
}

module.exports = {
    checkbusAvailability,
    checkDriverAvailability,
    checkConductorAvailability,
    createLinkedDuty,
    createUnlinkedDuty
}
