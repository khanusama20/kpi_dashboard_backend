const STATUS = require('../constants/statusCode');
const EC = require('../constants/errorCode');

function sendResponse (req, res, status, errCode, errMsg) {
  res.status(status).send({
    errCode,
    errMsg,
    date: new Date()
  });
}

// EC = Error code
module.exports = {
  success: (req, res, errMsg) => {
    if (typeof errMsg === 'string') {
      sendResponse(req, res, STATUS.OK, EC.DATA_NOT_FOUND, errMsg);
    } else if (Array.isArray(errMsg) && errMsg.length === 0) {
      sendResponse(req, res, STATUS.OK, EC.DATA_NOT_FOUND, 'Data not found');
    } else {
      sendResponse(req, res, STATUS.OK, EC.SUCCESS, errMsg);
    }
  },
  NotAcceptable (req, res, errMsg) {
    sendResponse(req, res, STATUS.VALIDATION, EC.VALIDATION_ERROR, errMsg);
  },
  Unauthorized (req, res, errMsg) {
    sendResponse(req, res, STATUS.UNAUTHORIZED, EC.UNAUTHORIZED, errMsg);
  }, 
  InternalServerError (req, res, errMsg) {
    sendResponse(req, res, STATUS.ERROR, EC.SERVER_ERROR, errMsg);
  },
  DatabaseError (req, res, errMsg) {
    sendResponse(req, res, STATUS.ERROR, EC.DATABASE_ERROR, errMsg);
  },
  BadRequest (req, res, errMsg) {
    sendResponse(req, res, STATUS.CLIENT_ERROR, EC.VALIDATION_ERROR, errMsg);
  }
}