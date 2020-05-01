const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');
const CodeController = require('../controllers/CodeController');

/**
 * User Routes
 */
router.get('/api/codes', auth,CodeController.getCodeByUser);

router.get('/api/codes/:id',auth,CodeController.getCodeByID);

/**
 * Admin Routes
 */
router.get('/api/admin/codes',adminAuth,CodeController.getAllCode);

router.post('/api/admin/codes',adminAuth,CodeController.createCode);

module.exports = router;