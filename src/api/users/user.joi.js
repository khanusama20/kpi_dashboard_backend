const joi = require('joi');
const {
  ALPHA_SPACE,
  MOBILE_NO,
  EMAIL,
  EMP_CODE
} = require('../../constants/pattern.regex');

const UserJoiSchema = joi.object({
  first_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  last_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  email: joi.string().max(50).pattern(EMAIL).required(true),
  mobile_no: joi.string().pattern(MOBILE_NO).required(true),
  gender: joi.string().valid("M", "F", "O").required(true),
  password: joi.string().required(true),
  emp_code: joi.string().pattern(EMP_CODE).required(true)
});

module.exports = {
  UserJoiSchema
}