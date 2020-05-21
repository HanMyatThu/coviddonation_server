const express = require('express');
const router = express.Router();
const AssistantController = require('../controllers/AssistantController');
const adminAuth = require('../middleware/adminAuth');
const basicAuth = require('../middleware/basicAuth');
/**
 * Admin Routes
 */
router.get('/api/admin/assistants',adminAuth, AssistantController.getAllAssistants);

router.post('/api/admin/assistants',adminAuth, AssistantController.createAssistant);

router.put('/api/admin/assistants/:id',adminAuth, AssistantController.updateAssistant);
/**
 * Public Routes
 */
router.post('/api/assistant/login', AssistantController.loginAssistant);

/**
 * Private Routes
 */
router.get('/api/assistant/get/qr/:id',basicAuth,AssistantController.getQrByID);

router.put('/api/assistant/get/qr/:id', basicAuth,AssistantController.updateQrByID);


module.exports = router;