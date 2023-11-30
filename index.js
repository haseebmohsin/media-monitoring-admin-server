const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api');
const connectDB = require('./config/db');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.use('/api', apiRoutes);

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
