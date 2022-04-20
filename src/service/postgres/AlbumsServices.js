const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { remakeAlbumStructure } = require('../../utils');

class AlbumsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year, cover = null }) {
    const generateId = nanoid(14);
    const id = `album-${generateId}`;
    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3, $4) RETURNING $1 as id',
      values: [id, name, year, cover],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album Gagal Di Tambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('Album Tidak Ditemukan');
    }
    const generateStructure = result.rows.map(remakeAlbumStructure);
    return generateStructure[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album, id tidak ditemukan');
    }
  }

  async editCoverAlbum(fileName, id) {
    const cover = `http://${process.env.HOST}:${process.env.PORT}/albumsCover/images/${fileName}`;
    const query = {
      text: 'UPDATE album SET cover = $1 WHERE id = $2',
      values: [cover, id],
    };

    await this._pool.query(query);
  }
}

module.exports = AlbumsServices;
