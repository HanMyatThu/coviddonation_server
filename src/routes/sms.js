const express = require('express');
const router = express.Router();
const adminauth = require('../middleware/adminAuth');
const SmsController = require('../controllers/SmsController');
const LogController = require('../controllers/LogController')

/**
 * Admin auths 
 * Private
 */
router.post('/api/admin/msg-service/sms/send',adminauth,SmsController.SendSMSToUserAfterApproved);

router.get('/api/admin/msg-service/sms/logs',adminauth, LogController.getAlllogs);

module.exports = router;