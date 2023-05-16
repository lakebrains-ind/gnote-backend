const express = require('express');
// const jwt = require('jsonwebtoken');
const users = require('../controller/user.controller');
const endcalls = require('../controller/endcall.controller')

// const router = express.Router();


const usersRouter = express.Router();

usersRouter.post('/sign-up', users.userCreate);

usersRouter.post('/end-call', endcalls.endcall );

// usersRouter.post('/mail', users.userMail);




module.exports = usersRouter;
