const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator/check');

const User = require('../models/signupform');
exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "error",
            errors: errors.array()
        });
    }
    if (!req.file) {
        return res.status(422).json({
            message: "error file",
            errors: errors.array()
        });
    }
    const email = req.body.email;
    const nickname = req.body.nickname;
    const password = req.body.password;
    const image = req.file.path;
    bcrypt
        .hash(password, 12)
        .then(hashedpw => {
            const user = new User({
                email: email,
                nickname: nickname,
                image: image,
                password: hashedpw
            });
            return user.save();
        }).then(result => {
            console.log(result);
            res.status(201).json({
                message: 'User Created Succesfully',
                user: result
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname;
    //console.log("Hello1");
    User.findOne({ email: email,nickname:nickname})
        .then(user => {
            if (!user) {
                const error = new Error('Incorrect Email or nickname');
                error.statusCode = 401;
                throw error;
            }
            //console.log("Hello");
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong Passsword');
                error.statusCode = 401;
                throw error;
            }
           res.status(201).json({
                message: 'User Signed in',
                nickname:loadedUser.nickname,
                image:loadedUser.image
            })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}