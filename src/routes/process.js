const express = require('express');
const router = express.Router();
const ProcessController = require('../controllers/ProcessController');
const auth = require('../middleware/auth');
const adminauth = require('../middleware/adminAuth');

/**
 * For User - Private Routes
 */
router.get('/api/process',auth,ProcessController.getProcessByUser );

router.post('/api/process',auth,ProcessController.createProcess);


/**
 * For Admin - Private Routes
 */
router.get('/api/admin/processes',adminauth, ProcessController.getAllProcess);

module.exports = router