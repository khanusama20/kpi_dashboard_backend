module.exports = {
  ALPHA_ONLY: /^[a-zA-Z]+$/,
  EMAIL: /^[A-Za-z0-9_.]+@[a-z]+[.][a-z]{2,3}$/,
  MOBILE_NO: /^[6-9]{1}[0-9]{9}$/,
  UID: /^PROF_[0-9]{6}_[0-9]{6}$/,
  ALPHA_SPACE: /^[a-zA-Z ]+$/,
  NUM_ONLY: /^[0-9]+$/,
  USERNAME: /^([6-9]{1}[0-9]{9}|[A-Za-z0-9._]+@[a-z]+[.][a-z]{2,3})$/,
  AADHAR_NO: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
  TIME: /^(1[0-2]|0?[1-9]):([0-5]?[0-9]) (AM|PM|am|pm)$/,
  DATE: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
  EMP_CODE:  /^[0-9]{7}$/,
  ALPHA_NUM: /^[a-zA-Z0-9]{6}$/,
  PAN_CARD_NO: /^([A-Za-z]){5}([0-9]){4}([A-Za-z]){1}$/
};