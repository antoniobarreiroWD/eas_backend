
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const energyRoutes = require('./routes/energyRoutes');
const reportRoutes = require('./routes/reportRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());


connectDB();


const cors = require('cors');
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/report', reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
