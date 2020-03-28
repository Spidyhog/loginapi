const express =require('express');
const {body} = require('express-validator/check');

const signupcontroller= require('../controllers/signup');
const User = require('../models/signupform');
const router = express.Router();

router.post('/signup',[
    body('email').isEmail().withMessage('Please Enter a valid Email')
    .custom((value,{req})=>{
        return User.findOne({email:value}).then(userDoc=>{
            if(userDoc) {
                return Promise.reject('Email address already exists');
            }
        })
    }).normalizeEmail(),
    body('nickname').trim()    .custom((value,{req})=>{
        return User.findOne({nickname:value}).then(userDoc=>{
            if(userDoc) {
                return Promise.reject('Nickname already exists');
            }
        })
    }),
    body('password').trim().isLength({min:5}),
    body('image').trim()
],signupcontroller.postSignup);

router.post('/signin',[
    body('email').isEmail().withMessage('Please Enter a valid Email')
    .custom((value,{req})=>{
        return User.findOne({email:value}).then(userDoc=>{
            if(userDoc) {
                return Promise.reject('Email address already exists');
            }
        })
    }).normalizeEmail(),
    body('nickname').trim()    .custom((value,{req})=>{
        return User.findOne({nickname:value}).then(userDoc=>{
            if(userDoc) {
                return Promise.reject('Nickname already exists');
            }
        })
    }),
    body('password').trim().isLength({min:5})],signupcontroller.signin);

module.exports = router;