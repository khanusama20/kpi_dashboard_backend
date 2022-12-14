let express = require('express');
let masterRoute = express.Router();
let kpiRoute = express.Router();

const channelController = require('../api/masters/channel.controller');
const roleController = require('../api/masters/role.controller');
const mappingController = require('../api/kpi/mapping.controller');
const kpiFieldController = require('../api/kpi/kpi_field_master.controller');
const uploadKPIController = require('../api/kpi/upload_kpi.controller');
const kpiGetController = require('../api/kpi/get.controller');
const hierarchyController = require('../api/masters/hierarchy.controller');
const designationController = require('../api/masters/designation.controller');

const controllers = {
  ...channelController,
  ...roleController,
  ...mappingController,
  ...kpiFieldController,
  ...uploadKPIController,
  ...kpiGetController,
  ...hierarchyController,
  ...designationController
}

masterRoute.post('/add-channel', controllers.createChannel);
masterRoute.post('/add-role', controllers.createRole);
masterRoute.post('/add-hierarchy', controllers.createHierarchy);
masterRoute.post('/add-designation', controllers.createDesignation);

kpiRoute.post('/mapping', controllers.columnMapping);
kpiRoute.post('/add-field', controllers.addNewLabel);
kpiRoute.post('/upload-kpi', controllers.bulkUploadKPI);
kpiRoute.get('/agent-kpi', controllers.agentKPI);


module.exports = [
  masterRoute,
  kpiRoute
];