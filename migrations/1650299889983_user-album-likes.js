/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(30)',
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: 'TEXT',
      notNull: true,
    },
    album_id: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.user_id',
    'FOREIGN KEY(user_id) REFERENCES users(id) on DELETE CASCADE',
  );
  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.album_id',
    'FOREIGN KEY(album_id) REFERENCES album(id) on DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
