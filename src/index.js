require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./libs/database.connection');
const { PORT } = require('./constants')

const authRoute = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database 
connectDB();


// Routes
app.use('/api/auth', authRoute);



// Server
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});