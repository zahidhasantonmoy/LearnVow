const express = require('express');
const { getSecureFile, generateSignedUrl } = require('../controllers/fileController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/secure-file/:signature', getSecureFile);
router.post('/generate-signed-url', authenticate, generateSignedUrl);

module.exports = router;