let express = require('express');
let masterRoute = express.Router();

const [UserAuthRouteSet, UserRouteSet] = require('./user.routes');
const ApplicationMastersRoute = require('./masters.routes');

masterRoute.use('/user', UserAuthRouteSet);
masterRoute.use('/master-data', ApplicationMastersRoute);

module.exports = masterRoute;