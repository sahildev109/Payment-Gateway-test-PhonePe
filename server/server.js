const express= require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
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


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
         maxAge: 24 * 60 * 60 * 1000 
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
