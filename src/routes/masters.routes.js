let express = require('express');
let masterRoute = express.Router();

const channelController = require('../api/masters/channel.controller');

masterRoute.post('/add-channel', channelController.createChannel);

module.exports = masterRoute