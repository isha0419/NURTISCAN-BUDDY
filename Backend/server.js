require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({
  origin: 'https://nurtiscan-buddy2.onrender.com', // your Vite frontend URL
  credentials: true, // allows cookies to be sent
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'Backend is running' }));

app.use('/api/auth', require('./routes/authRoutes.route'));
app.use('/api/food', require('./routes/foodRoutes.route'));
app.use('/api/ai', require('./routes/aiRoutes.route'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));