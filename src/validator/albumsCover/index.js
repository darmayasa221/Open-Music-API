const InvariantError = require('../../exceptions/InvariantError');
const { AlbumsCoverHeadersSchema } = require('./schema');

const AlbumsCoverValidator = {
  validateAlbumsCover: (payload) => {
    const validationResult = AlbumsCoverHeadersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsCoverValidator;
