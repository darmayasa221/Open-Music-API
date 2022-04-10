/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(30)',
      notNull: true,
      primaryKey: true,
    },
    username: {
      type: 'TEXT',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('users', 'unique_username', 'UNIQUE(username)');
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
