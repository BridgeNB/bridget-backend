'use strict'
const express  = require('express');
const morgan   = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors     = require('cors');

const { CLIENT_ORIGIN, PORT, HTTP_STATUS_CODES, MONGO_URL, TEST_MONGO_URL } = require('./config');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');

const { userRouter } = require('./user/user.router');
const { authRouter } = require('./auth/auth.router');
const { postRouter } = require('./post/post.router');
const { commentRouter } = require('./comment/comment.router');

let server;

const app = express();
passport.use(localStrategy);
passport.use(jwtStrategy);

// Middleware
app.use(cors()); 
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('./public'));

// Router setup
app.use('/api/auth',    authRouter);
app.use('/api/user',    userRouter);
app.use('/api/post',    postRouter);
app.use('/api/comment', commentRouter);

app.use('*', (req, res) => {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        error: '404 Not found.'
    })
});

function startServer(testEnv) {
    return new Promise((resolve, reject) => {
        let mongoUrl;
        if (testEnv) {
            mongoUrl = TEST_MONGO_URL;
        } else {
            mongoUrl = MONGO_URL;
        }
        mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
            if (err) {
                console.log(err);
                return reject();
            } else {
                server = app.listen(PORT, () => {
                    console.log(`Express server listening on http://localhost:${PORT}`);
                    resolve();
                }).on('error', err => {
                    mongoose.disconnect();
                    console.error(err);
                    reject(err);
                });
            }   
        });
    });
}

function stopServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    console.err(err);
                    return reject();
                } else {
                    console.log('Express server shut down.');
                    resolve();
                }
            });
        });
    });
}

module.exports = {
    app,
    startServer,
    stopServer
}