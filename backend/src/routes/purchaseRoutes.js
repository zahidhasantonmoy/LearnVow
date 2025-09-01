const express = require('express');
const { purchaseBook } = require('../controllers/purchaseController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, purchaseBook);

module.exports = router;