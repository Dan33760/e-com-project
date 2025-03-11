const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid Email.!')
        .custom((value, { req }) => {
            // if(value === 'dan0@gmail.com') {
            //     throw new Error('This email address is forbidden.');
            // }
            // return true;
            return User.findOne({ email: value }).then(userFind => {
                if(userFind) {
                    return Promise.reject(
                        'E-mail exists already, please pick a different one'
                    );
                }
            });
            
        }),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters'
        ).isLength({ min: 5 }).isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if(value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
    ]
    ,authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;