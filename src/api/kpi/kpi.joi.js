const joi = require('joi');
const {
  ALPHA_SPACE
} = require('../../constants/pattern.regex');

const MappingJoiSchema = joi.object({
  mapping_for: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  col_mappings: joi.array().items(joi.object({
    label_name: joi.string().required(),
    sheet_col_name: joi.string().required(),
  }))
});

module.exports = {
  MappingJoiSchema
}