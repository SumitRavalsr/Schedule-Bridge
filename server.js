require('dotenv').config();
const express = require('express')
const connectToDB = require('./database/db')
const authRoutes = require('./routes/auth_routes')
const homeRoutes = require('./routes/home_routes')
const adminRoutes = require('./routes/admin_routes')
const userRoutes = require('./routes/user_routes')
const bookingRoutes = require('./routes/booking_routes')

const app = express();
const PORT = process.env.PORT || 3000;

require('./cron/appointmentChecker')

const path = require('path')
// pages
const {serveLoginPage} = require('./controllers/user_frontend_controller')
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// const {signupPage, homePage, aboutPage} = require('./controllers/user_frontend_controller')
app.use(express.static(path.join(__dirname,'views')))
app.get('/',serveLoginPage)


// Middlewares
app.use(express.json());// To parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // To parse form data (if using forms)

// app.use(express.json()); is a middleware in Express.js that parses incoming JSON payloads and makes the parsed data available in req.body.

// In simple terms:
// Whenever a client sends a request with a JSON body, this line ensures that Express can understand and access that JSON.

// Example:
// Without express.json(), req.body will be undefined for JSON payloads.


// app.use('/schedule-bridge/auth',authRoutes)
app.use('/schedule-bridge/auth',authRoutes)
app.use('/', adminRoutes)
app.use('/schedule-bridge/', homeRoutes)
app.use('/',userRoutes)
app.use(bookingRoutes)



connectToDB()

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}/`)
})
