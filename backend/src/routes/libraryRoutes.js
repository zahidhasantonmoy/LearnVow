const express = require('express');
const { getUserLibrary } = require('../controllers/libraryController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getUserLibrary);

module.exports = router;