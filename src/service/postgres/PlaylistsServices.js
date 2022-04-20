const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { generateId, uniqueValuePlaylistName } = require('../../utils');

class PlaylistsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = generateId('playlist');
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING $1 as "playlistId"',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].playlistId) {
      throw new InvariantError('Gagal menambahkan Playlists');
    }
    return result.rows[0].playlistId;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM playlists
              INNER JOIN users ON playlists.owner = users.id
              WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    const playlists = result.rows.filter(uniqueValuePlaylistName);
    return playlists;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('gagal menghapus Id Tidak ada');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    await this.verifyPlaylistOwner(playlistId, userId);
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    const playlitst = result.rows[0];
    if (playlitst.owner !== owner) {
      throw new AuthorizationError('tidak berhak membuka plyalist');
    }
  }
}

module.exports = PlaylistsServices;
