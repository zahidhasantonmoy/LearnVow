const express = require('express');
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/initiate', authenticate, initiatePayment);
router.post('/verify', verifyPayment); // This endpoint will be called by SSLCommerz webhook

module.exports = router;