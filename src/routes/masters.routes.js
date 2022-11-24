let express = require('express');
let masterRoute = express.Router();

const channelController = require('../api/masters/channel.controller');
const roleController = require('../api/masters/role.controller');

const controllers = {
  ...channelController,
  ...roleController
}

masterRoute.post('/add-channel', controllers.createChannel);
masterRoute.post('/add-role', controllers.createRole);

module.exports = masterRoute