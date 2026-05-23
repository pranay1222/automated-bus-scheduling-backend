require('dotenv').config()   // load .env file first, always

const express = require('express')
const cors    = require('cors')

const app = express()

app.use(cors())
app.use(express.json())


<<<<<<< HEAD
const busRoutes   = require('./routes/bus.js')
const crewRoutes  = require('./routes/crew.js')
const dutyRoutes  = require('./routes/duty.js')
const routeRoutes = require('./routes/route.js')
const reportRoutes = require('./routes/report.js')

app.use('/api', busRoutes)
app.use('/api', crewRoutes)
app.use('/api', dutyRoutes)
app.use('/api', routeRoutes)
app.use('/api', reportRoutes)
=======
// We will uncomment these one by one as we build each module
// const busRoutes   = require('./routes/bus.routes')
// const crewRoutes  = require('./routes/crew.routes')
const dutyRoutes  = require('./routes/duty.js')
// const routeRoutes = require('./routes/route.routes')

// app.use('/api', busRoutes)
// app.use('/api', crewRoutes)
app.use('/api', dutyRoutes)
// app.use('/api', routeRoutes)
>>>>>>> 4fbd3db5118425629dfcd43215f37e92fbad00ce


app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DTC backend is running!' })
})


app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong.'
  })
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})