const joi = require('joi');
const {
  ALPHA_SPACE
} = require('../../constants/pattern.regex');

const ChannelMasterJoiSchema = joi.object({
  channel_name: joi.string().min(3).max(250).pattern(ALPHA_SPACE).required(true)
});

module.exports = {
  ChannelMasterJoiSchema
}