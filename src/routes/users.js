const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const userauth = require('../middleware/auth');
const adminauth = require('../middleware/adminAuth');
const publicauth = require('../middleware/publicAuth');

/**
 * Public Routes
 */
// router.post('/users/login', UserController.UserLogin);

router.post('/users/register', publicauth,UserController.CreateUser);

router.post('/users/register/confirmed',publicauth, UserController.userOtp);

router.post('/users/login/checked',publicauth, UserController.checkIfUserisExisted);

/**
 * Private Routes
 */
router.get('/users/me', userauth, UserController.getProfileData);

router.post('/users/logout', userauth,UserController.UserLogout);

router.post('/users/logoutAll', userauth, UserController.UserLogoutAll);

/**
 * Admin Routes
 */
router.post('/api/admin/users',adminauth,UserController.CreateUser);

router.get('/api/admin/users',adminauth, UserController.getAllUser);

router.get('/api/admin/users/:id',adminauth, UserController.getUserById);

router.put('/api/admin/users/:id/approved', adminauth,UserController.ApprovedUser);

router.delete('/api/admin/users/:id',adminauth, UserController.deletUser);

router.put('/api/admin/users/password/reset/:id',adminauth,UserController.changeUserPassword);


module.exports = router