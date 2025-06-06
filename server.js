const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const productRoute = require('./routes/api/productRoute');

// Connecting to the Database
// Modified to use MONGO_URI environment variable with fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yolomy';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

let db = mongoose.connection;

// Check Connection
db.once('open', () => {
    console.log('Database connected successfully')
})

// Check for DB Errors
db.on('error', (error) => {
    console.log(error);
})

// Initializing express
const app = express()

// Body parser middleware
app.use(express.json())

// 
app.use(upload.array()); 

// Cors 
app.use(cors());

// Use Route
app.use('/api/products', productRoute)

// Define the PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

