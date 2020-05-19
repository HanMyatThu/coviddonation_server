const express = require('express');
const router = express.Router();
const QrController = require('../controllers/QrController');

router.get('/admin/login', (req,res)=> {
    res.render('login');
})

router.get('/admin/register', (req,res)=> {
    res.render('register');
})

router.get('/admin/dashboard', (req,res)=> {
    res.render('dashboard');
})

router.get('/admin/users', (req,res)=> {
    res.render('users');
})

router.get('/admin/logs' , (req,res) => {
    res.render('sms');
})


router.get('/admin/settings' , (req,res) => {
    res.render('setting');
})


router.get('/admin/requests' , (req,res) => {
    res.render('request');
})


router.get('/admin/machines', (req,res)=> {
    res.render('machine');
})

router.get('/admin/codes', (req,res) => {
    res.render('code');
})

router.get('/admin/process', (req,res)=> {
    res.render('process');
})

router.get('/admin/qrcode', (req,res) => {
    res.render('qrcode');
})

router.get('/process/qr/fail',(req,res) => {
    res.render('error',{ error : "Please try again later."})
})
router.get('/process/qr/success',(req,res) => {
    res.render('success');
})

// router.get('/admin/qractivate',(req,res) => {
//     res.render('qractivate')
// })

//test route
//remove later
router.get('/test/process', (req,res) => {
    res.render('test');
})

router.get('/process/qr/:option1/:qrid/:option2', QrController.scanningQR);


module.exports = router;