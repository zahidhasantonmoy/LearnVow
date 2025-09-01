const express = require('express');
const { getProgress, updateProgress } = require('../controllers/readingProgressController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:bookId', authenticate, getProgress);
router.post('/:bookId', authenticate, updateProgress);

module.exports = router;