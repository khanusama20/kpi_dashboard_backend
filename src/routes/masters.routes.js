let express = require('express');
let masterRoute = express.Router();
let kpiRoute = express.Router();

const channelController = require('../api/masters/channel.controller');
const roleController = require('../api/masters/role.controller');
const mappingController = require('../api/kpi/mapping.controller');
const kpiFieldController = require('../api/kpi/kpi_field_master.controller');
const uploadKPIController = require('../api/kpi/upload_kpi.controller');
const kpiGetController = require('../api/kpi/get.controller');

const controllers = {
  ...channelController,
  ...roleController,
  ...mappingController,
  ...kpiFieldController,
  ...uploadKPIController,
  ...kpiGetController
}

masterRoute.post('/add-channel', controllers.createChannel);
masterRoute.post('/add-role', controllers.createRole);

kpiRoute.post('/mapping', controllers.columnMapping);
kpiRoute.post('/add-field', controllers.addNewLabel);
kpiRoute.post('/upload-kpi', controllers.bulkUploadKPI);
kpiRoute.get('/agent-kpi', controllers.agentKPI);


module.exports = [
  masterRoute,
  kpiRoute
];