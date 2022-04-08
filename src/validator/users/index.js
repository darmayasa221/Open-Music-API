const InvariantError = require('../../exceptions/InvariantError');
const { UsersSchema } = require('./schema');

const UsersValidator = {
  validateUsersPayload: (payload) => {
    const validationResult = UsersSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
