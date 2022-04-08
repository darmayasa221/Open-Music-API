const Joi = require('joi');

const UsersSchema = {
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
};

module.exports = { UsersSchema };
