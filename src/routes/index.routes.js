let express = require('express');
let masterRoute = express.Router();

const [UserAuthRouteSet, UserRouteSet] = require('./user.routes');

masterRoute.use('/user', UserAuthRouteSet);

module.exports = masterRoute;