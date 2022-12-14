const joi = require('joi');
const {
  ALPHA_SPACE,
  CH_ID,
  RC_ID,
  HC_ID
} = require('../../constants/pattern.regex');

const ChannelMasterJoiSchema = joi.object({
  channel_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true)
});

const RoleMasterJoiSchema = joi.object({
  role_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  channel_id: joi.string().min(3).max(250).pattern(CH_ID).required(true),
});

const HierarchyMasterJoiSchema = joi.object({
  hierarchy_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  channel_id: joi.string().min(3).max(250).pattern(CH_ID).required(true),
  level_code: joi.number().required(true)
});

const DesignationMasterJoiSchema = joi.object({
  designation_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true),
  hierarchy_id: joi.string().min(3).max(250).pattern(HC_ID).required(true),
  role_id: joi.string().min(3).max(250).pattern(RC_ID).required(true),
  channel_id: joi.string().min(3).max(250).pattern(CH_ID).required(true),
});

module.exports = {
  ChannelMasterJoiSchema,
  RoleMasterJoiSchema,
  HierarchyMasterJoiSchema,
  DesignationMasterJoiSchema
}