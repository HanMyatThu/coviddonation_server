const express = require('express')
const router = express.Router();
const QrCode = require('../utils/qrcode');
const adminauth = require('../middleware/adminAuth');
const QrController = require('../controllers/QrController');

router.get('/api/download/qrcode/qr/:name/:phone/:township/:street',adminauth,QrCode.downloadPNG);

router.get('/api/download/qrcode/defaultqr',adminauth,QrCode.downloadPNGDefault);

router.get('/api/admin/qr/:id',adminauth,QrController.getQrById);

router.put('/api/admin/qr/:id',adminauth,QrController.updateQrById);


module.exports = router;