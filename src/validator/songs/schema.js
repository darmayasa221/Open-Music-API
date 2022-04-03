const Joi = require('joi');

const SongsSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumid: Joi.string(),
});

module.exports = { SongsSchema };