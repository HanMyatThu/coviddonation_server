const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const adminAuth = require('../middleware/adminAuth');

/**
 * Public routes
 */
router.post('/api/admins/admin/register/', AdminController.AdminRegister);

router.post('/api/admins/admin/login', AdminController.AdminLogin);

/***
 * Private routes
 */
router.get('/api/admins/admin/me', adminAuth,AdminController.getProfile);

router.put('/api/admins/admin/setting',adminAuth, AdminController.updateSetting);
 
router.post('/api/admins/admin/logout',adminAuth, AdminController.AdminLogout);

router.post('/api/admins/admin/logoutAll',adminAuth, AdminController.AdminLogoutAll);

router.post('/api/admins/admin/password/reset',adminAuth,AdminController.changePassword);

module.exports = router;