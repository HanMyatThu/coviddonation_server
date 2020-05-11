const express = require('express');
const router = express.Router();
const adminauth = require('../middleware/adminAuth');
const SmsController = require('../controllers/SmsController');

router.post('/api/admin/msg-service/sms/send',adminauth,SmsController.SendSMSToUserAfterApproved);

module.exports = router;