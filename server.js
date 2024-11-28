const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
connectDB();

app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: 'https://todo-frontend-two-beta.vercel.app/',
        credentials: true, 
    })
);

app.use('/', authRoutes);
app.use('/auth', authRoutes);
app.use('/task' , taskRoutes);

const PORT = process.env.PORT || 8000

app.listen(PORT ,() => {
    console.log(`Server is up and runnig on ${PORT}`);
})