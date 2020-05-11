const express = require('express');
const router = express.Router();
const adminauth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');
const CodeController = require('../controllers/CodeController');

/**
 * Private Routes
 */
router.get('/api/codes',auth, CodeController.getCodeByLogin);


/**
 * Admin Routes
 */
router.post('/api/admin/codes',adminauth,CodeController.createCode);

router.get('/api/admin/codes',adminauth,CodeController.getAllCode);

router.get('/api/admin/logicapp/codes',adminauth,CodeController.getAllCodesForLogicApp);

router.get('/api/admin/codes/user/:id',adminauth,CodeController.getCodeByUser);

router.put('/api/admin/logicapp/codes/:id',adminauth,CodeController.renewCodeForLogicApp);

router.put('/api/admin/codes/:id',adminauth,CodeController.updateCode);

router.delete('/api/admin/codes/:id', adminauth,CodeController.deleteCodeByID)


module.exports = router;