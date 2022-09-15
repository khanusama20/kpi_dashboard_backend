const { VALIDATION_ERROR, DATABASE_ERROR, SERVER_ERROR} = require('../constants/errorCode')
function getErrorResponse(error) {
  let result = {
    errMessage: null,
    errCode: null,
    statusCode: null,
  };

  if (error.name === 'ValidationError') {
    result = {
      errMessage: error.message,
      errCode: VALIDATION_ERROR,
      statusCode: 400,
    };
  } else if (error.name === 'CastError') {
    result = {
      errMessage: 'Database Error',
      errCode: DATABASE_ERROR,
      statusCode: 500,
    };
  } else {
    result = {
      errMessage: 'Internal Server Error',
      errCode: SERVER_ERROR,
      statusCode: 500,
    };
  }
  return result;
}

