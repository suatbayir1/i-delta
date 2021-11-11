const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const cors = require("cors");
const auth = require('./middlewares/auth');
require('dotenv/config')

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(expressValidator());
app.use(auth.isAuthenticated);

// Import Routes
const postsRoute = require('./routes/posts');
const didRoute = require('./routes/did');

app.use('/api/posts', postsRoute);
app.use('/api/did', didRoute);

// Routes
app.get("/", (req, res) => {
    res.send('We are on home')
})

// connect to db 
mongoose.connect(
    process.env.DB_CONNECTION,
    () => console.log("connected to db")
)

// Listen
app.listen(3001);