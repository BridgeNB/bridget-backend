const express = require('express');
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config.js');
const { User, UserJoiSchema } = require('./user.model.js');

const userRouter = express.Router();

// Create new user
userRouter.post('/', (req, res) => {
    const newUser = {
        name:       req.body.name,
        email:      req.body.email,
        username:   req.body.username,
        password:   req.body.password
    };
    
    const validation = Joi.validate(newUser, UserJoiSchema);

    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }

    User.findOne({
        $or: [
            { email: newUser.email },
            { username: newUser.username }
        ]
    }).then( user => {
        if (user) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Database Error: A user with that username and/or email already existed.'});
        }
        return User.hashPassword(newUser.password);
    }).then( passwordHash => {

        newUser.password = passwordHash;

        User.create(newUser)
            .then(createdUser => {
                return res.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
            })
            .catch(err => {
                return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
    });
});

// Retrieve user
userRouter.get('/', (req, res) => {
    User.find()
        .then(users => {
            return res.status(HTTP_STATUS_CODES.OK).json(
                users.map(user => user.serialize())
            );
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});


// Retrive one user
userRouter.get('/:userid', (req, res) => {
    User.findById(req.params.userid)
        .then(user => {
            return res.status(HTTP_STATUS_CODES.OK).json(user.serialize());
        })
        .catch(err => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
        });
});

module.exports = { userRouter };