const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { generateId, playlistSongsStructure } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(songId, playlistId) {
    const id = generateId('playlistsong');
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistSong(id) {
    const query = {
      text: `SELECT playlist_songs.*, song.title, song.performer, playlists.*, users.username
      FROM playlist_songs
      LEFT JOIN song ON song.id = playlist_songs.song_id
      LEFT JOIN playlists on playlists.id = $1
      LEFT JOIN users on users.id = playlists.owner
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return playlistSongsStructure(result.rows);
  }

  async deletePlaylistSong(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('song gagal dihapus');
    }
  }
}

module.exports = PlaylistSongsService;
