let express = require('express');
let userRoutes = express.Router();
let authRoutes = express.Router();

const user = require('../api/users/user.controller');

authRoutes.post('/register-agent', user.agentSignUp);
authRoutes.post('/login', user.login);

module.exports = [
  authRoutes,
  userRoutes
];