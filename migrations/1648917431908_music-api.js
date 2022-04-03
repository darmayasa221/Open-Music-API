/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('album', {
    id: {
      type: 'VARCHAR(20)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
  });
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(20)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: false,
    },
    albumId: {
      type: 'VARCHAR(20)',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('album');
  pgm.dropTable('songs');
};
