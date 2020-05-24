const express = require('express')
const router = express.Router();
const QrCode = require('../utils/qrcode');
const adminauth = require('../middleware/adminAuth');
const QrController = require('../controllers/QrController');
const publicAuth = require('../middleware/publicAuth');

router.get('/api/download/qrcode/qr/:name/:phone/:township/:street',adminauth,QrCode.downloadPNG);

router.get('/api/download/qrcode/defaultqr',adminauth,QrCode.downloadPNGDefault);

router.get('/api/download/qrcode/qr/:qrid/:phone',adminauth,QrCode.downloadPNGByID);

router.get('/api/admin/qr/list',adminauth,QrController.getQrList);

router.get('/api/admin/qr/:id',adminauth,QrController.getQrById);

router.put('/api/admin/qr/:id',adminauth,QrController.updateQrById);

/**
 * Public routes
 */
router.get('/api/v2/client/qr/login/download/:id',publicAuth, QrCode.downloadQrForRegisteredUser);

router.get('/api/v2/client/qr/download/:id',publicAuth, QrCode.downloadPNGfromClient);



module.exports = router;