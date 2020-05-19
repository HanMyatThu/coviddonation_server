const express = require('express');
const router = express.Router();
const ProcessController = require('../controllers/ProcessController');
const auth = require('../middleware/auth');
const adminauth = require('../middleware/adminAuth');
const basicAuth = require('../middleware/qrAuth');
/**
 * For User - Private Routes
 */
router.get('/api/process',auth,ProcessController.getProcessByUser );

router.post('/api/process',auth,ProcessController.createProcess);


/**
 * For Admin - Private Routes
 */
router.get('/api/admin/processes',adminauth, ProcessController.getAllProcess);

router.post('/api/admin/processes',adminauth, ProcessController.createProcessFromAdmin);

router.delete('/api/admin/process/:id',adminauth, ProcessController.deleteProcess);

router.get('/api/admin/process/filter',adminauth,ProcessController.filterProcess);

router.get('/api/admin/process/filter/time/:from/:to',adminauth,ProcessController.filterProcessByTime);

/**
 * For QR Function
 */
router.post('/api/admin/qr/process/',adminauth, ProcessController.createProcessFromQr);

/**
 * remove later
 */
router.post('/admin/test/test/process',ProcessController.testDevice);

/**
 * For Logic App
 */
router.put('/api/admin/logicapp/processes', ProcessController.updateProccessById);

module.exports = router