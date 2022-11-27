let express = require('express');
let masterRoute = express.Router();

const [UserAuthRouteSet, UserRouteSet] = require('./user.routes');
const [MastersRouteSet, KPIRouteSet] = require('./masters.routes');

masterRoute.use('/user', UserAuthRouteSet);
masterRoute.use('/master-data', MastersRouteSet);
masterRoute.use('/kpi', KPIRouteSet);

module.exports = masterRoute;