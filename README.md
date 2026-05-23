# DTC Automated Bus Scheduling System — Backend
Backend REST API for the Delhi Transport Corporation Automated Bus Scheduling System. Built with Node.js, Express.js, and MySQL.
# Team
- Pranay | Umang — Backend (Node.js + Express.js)
- Ninad — Database (MySQL)
- Anurag — Frontend (HTML/CSS/JS)

# Tech Stack
- Node.js + Express.js
- MySQL (mysql2)
- dotenv, cors

# Setup
1. Clone the repo
   git clone https://github.com/your-username/automated-bus-scheduling-backend.git
2. Install dependencies
   npm install
3. Create a .env file in the root
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=abss
   PORT=3000
4. Import the database
5. Run the server
   npm run dev

# API Endpoints

| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| GET    | /api/health                   | Health check                       |
| POST   | /api/create-duty              | Create linked or unlinked duty     |
| GET    | /api/get-duties               | Get all duties                     |
| GET    | /api/get-duties-by-date       | Get duties by date                 |
| GET    | /api/get-bus-data             | Get all buses                      |
| GET    | /api/get-crew-data            | Get all crew members               |
| GET    | /api/get-routes               | Get all routes with stops          |
| POST   | /api/add-route                | Add a new route                    |
| POST   | /api/routes/check-overlap     | Check route overlap                |
| GET    | /api/reports/crew             | Crew duty count report             |
| GET    | /api/reports/bus              | Bus utilization report             |
| GET    | /api/reports/duty-type        | Linked vs Unlinked summary         |
| GET    | /api/reports/daily            | Daily duty summary                 |
| GET    | /api/reports/route            | Route usage report                 |
