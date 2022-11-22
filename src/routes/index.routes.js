let express = require('express');
let masterRoute = express.Router();

const [UserAuthRouteSet, UserRouteSet] = require('./user.routes');
const ChannelMasterRoute = require('./masters.routes');

masterRoute.use('/user', UserAuthRouteSet);
masterRoute.use('/master-data', ChannelMasterRoute);

module.exports = masterRoute;