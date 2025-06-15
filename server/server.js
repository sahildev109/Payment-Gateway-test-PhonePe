const express= require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const courseRoutes = require('./routes/courseRoutes');
const orderRoutes = require('./routes/orderRoutes');
dotenv.config();
const app = express();
app.use(cors({
      origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));


// ✅ Session Configuration with MongoDB
app.use(session({
    secret: 'your_secret_key', // Change to a strong secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Store sessions in your MongoDB
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Helps prevent XSS
        sameSite: 'lax', // Allows returning from external payment gateways
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));


app.get('/', (req, res) => {
    res.send('Welcome to the API!');
})

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/order', orderRoutes);


connectDB().then(() => {
   
    app.listen(3000, () => {
        console.log(`Server is running on http://localhost:3000`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1); // Exit the process with failure
});
