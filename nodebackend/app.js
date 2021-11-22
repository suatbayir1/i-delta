const express = require("express");
const app = express();
const expressValidator = require('express-validator');
const cors = require("cors");
const auth = require('./middlewares/auth');
const connectDatabase = require('./helpers/database/connectDatabase');
const routers = require('./routes/index');
const customErrorHandler = require('./middlewares/errors/customErrorHandler');
require('dotenv/config')

// Middlewares
app.use(cors());
app.use(expressValidator());
app.use(auth.isAuthenticated);

// Express BodyParser
app.use(express.json());

// Mongodb Connection
connectDatabase();

// Routers Middleware
app.use('/api', routers);

// Error Handling
app.use(customErrorHandler);

// App start
app.listen(process.env.PORT, () => {
    console.log(`App started on ${process.env.PORT} : ${process.env.NODE_ENV}`);
})
