/**
 * Contact API Routes
 */
const express = require('express');
const router = express.Router();
const { submitContactMessage } = require('../controllers/contactController');

// POST /api/contact - handles form submissions
router.post('/', submitContactMessage);

module.exports = router;
