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
  pgm.createTable('song', {
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
    performer: {
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

  pgm.addConstraint('song', 'fk_song.albumId_album.id', 'FOREIGN KEY(albumId) REFERENCES album(id) on DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('album');
  pgm.dropTable('song');
};
