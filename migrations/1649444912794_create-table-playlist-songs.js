/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(30)',
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: 'TEXT',
      notNull: true,
    },
    song_id: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlist_songs',
    'fk_palylist_songs.playlist_id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) on DELETE CASCADE',
  );
  pgm.addConstraint(
    'playlist_songs',
    'fk_palylist_songs.song_id',
    'FOREIGN KEY( song_id) REFERENCES song(id) on DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
