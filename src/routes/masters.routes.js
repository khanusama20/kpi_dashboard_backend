let express = require('express');
let masterRoute = express.Router();
let kpiRoute = express.Router();

const channelController = require('../api/masters/channel.controller');
const roleController = require('../api/masters/role.controller');
const mappingController = require('../api/kpi/mapping.controller');

const controllers = {
  ...channelController,
  ...roleController,
  ...mappingController
}

masterRoute.post('/add-channel', controllers.createChannel);
masterRoute.post('/add-role', controllers.createRole);

kpiRoute.post('/mapping', controllers.columnMapping)

module.exports = [
  masterRoute,
  kpiRoute
]