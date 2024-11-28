const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB();

app.use(express.json());

const corsOptions = {
    origin: 'https://todo-frontend-two-beta.vercel.app/',
    credentials: true,
};
app.use(cors(corsOptions));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 8000

app.listen(PORT ,() => {
    console.log(`Server is up and runnig on ${PORT}`);
})