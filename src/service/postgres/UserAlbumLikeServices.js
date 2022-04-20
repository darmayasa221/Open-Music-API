const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const { generateId } = require('../../utils');

class UserAlbumLikeServices {
  constructor(cacheService) {
    this._cacheService = cacheService;
    this._pool = new Pool();
  }

  async addUserAlbumLike({ credentialId, albumId }) {
    const id = generateId('albumLike');

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)',
      values: [id, credentialId, albumId],
    };

    await this._pool.query(query);
  }

  async deleteUserAlbumLike(id) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getUserAlbumLike({ albumId }) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return result;
    } catch (error) {
      const query = {
        text: 'SELECT id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rows.length));
      return result.rows.length;
    }
  }

  async verifyAlbum({ albumId }) {
    const query = {
      text: 'SELECT id FROM album WHERE id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('kosong');
    }
  }

  async verifyUserAlbumLike({ credentialId, albumId }) {
    await this.verifyAlbum({ albumId });

    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);

    const user = result.rows.find(({ user_id }) => user_id === credentialId);
    await this._cacheService.delete(`likes:${albumId}`);
    if (user === undefined) {
      await this.addUserAlbumLike({ credentialId, albumId });
      return;
    }
    await this.deleteUserAlbumLike(user.id);
  }
}

module.exports = UserAlbumLikeServices;
