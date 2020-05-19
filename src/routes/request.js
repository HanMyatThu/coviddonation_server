const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');
const RequestController = require('../controllers/RequestController')
/**
 * Private Routes
 * For login users
 */
router.post('/api/request',auth, RequestController.createRequest );

/**
 * Private Routes
 * For admins
 */
router.get('/api/admin/requests',adminAuth,RequestController.getallRequests);

router.put('/api/admin/requests/:id',adminAuth,RequestController.updateRequets);

module.exports = router;