'use strict';
const express = require('express');
const Joi = require('joi');
const commentRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Comment } = require('../comment/comment.model');

commentRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const newComment = {
        postid: req.body.postid,
        author: req.user.id,
        content: req.body.content,
        createdDate: Date.now()
    };

    Comment.create(newComment)
        .then(createdComment => {
            return res.status(HTTP_STATUS_CODES.CREATED).json(createdComment.serialize());
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { commentRouter };