const joi = require('joi');
const {
  ALPHA_SPACE,
  MOBILE_NO,
  EMAIL,
  DATE,
  EMP_CODE,
  PAN_CARD_NO
} = require('../../constants/pattern.regex');

const UserJoiSchema = joi.object({
  first_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  last_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  email: joi.string().max(50).pattern(EMAIL).required(true),
  mobile_no: joi.string().pattern(MOBILE_NO).required(true),
  gender: joi.string().valid("Male", "Female", "Other").required(true),
  birth_date: joi.string().pattern(DATE).required(true),
  password: joi.string().required(true),
  emp_code: joi.string().pattern(EMP_CODE).required(true),
  state: joi.string(),
  city: joi.string(),
  pan_no: joi.string().pattern(PAN_CARD_NO).required(true)
});

module.exports = {
  UserJoiSchema
}