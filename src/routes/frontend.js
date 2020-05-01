const express = require('express');
const router = express.Router();

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


router.get('/admin/machines', (req,res)=> {
    res.render('machine');
})

router.get('/admin/process', (req,res)=> {
    res.render('process');
})

module.exports = router;