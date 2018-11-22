'use strict';
const express = require('express');
const Joi = require('joi');
const postRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Post } = require('../post/post.model');
const { Comment } = require('../comment/comment.model');

/****** Create new post */
postRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const newPost = {
        title: req.body.title,
        author: req.user.id,
        content: req.body.content,
        updatedDate: null,
        tags: req.body.tags,
        comments: req.body.comments
    };

    Post.create(newPost)
        .then(createdPost => {
            return res.status(HTTP_STATUS_CODES.CREATED).json(createdPost.serialize());
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});


/****** create new comment below certain post */
postRouter.post('/:postid/comments', jwtPassportMiddleware, (req, res) => {
    const newComment = {
        content: req.body.content,
        author: req.user.id
    };

    Post.findById(req.params.postid)
        .then(post => {
            post.comments.push(newComment);
            post.save();
        })
        .then(() => {
            return res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { postRouter };