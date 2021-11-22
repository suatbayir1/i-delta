// Libraries
const express = require('express');
const router = express.Router();

// Route modules
const postsRoute = require('./posts');
const didRoute = require('./did');
const ebsiRoute = require('./ebsi');

// Routers
router.use('/posts', postsRoute);
router.use('/did', didRoute);
router.use('/ebsi', ebsiRoute);

module.exports = router;