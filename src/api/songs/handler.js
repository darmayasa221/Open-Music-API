const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;
      const { songid } = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });
      const respone = h.response({
        status: 'success',
        data: {
          songId: songid,
        },
      });
      respone.code(201);
      return respone;
    } catch (error) {
      if (error instanceof ClientError) {
        const respone = h.response({
          status: 'fail',
          message: error.message,
        });
        respone.code(error.statusCode);
        return respone;
      }
      const respone = h.response({
        status: 'error',
        message: error.message,
      });
      respone.code(500);
      return respone;
    }
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const respone = h.response({
          status: 'fail',
          message: error.message,
        });
        respone.code(error.statusCode);
        return respone;
      }
      const respone = h.response({
        status: 'error',
        message: error.message,
      });
      respone.code(500);
      return respone;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const { title, year, genre, performer, duration, albumId } =
        request.payload;

      await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });
      return {
        status: 'success',
        message: 'song berhasil di edit',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const respone = h.response({
          status: 'fail',
          message: error.message,
        });
        respone.code(error.statusCode);
        return respone;
      }
      const respone = h.response({
        status: 'error',
        message: error.message,
      });
      respone.code(500);
      return respone;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return {
        status: 'success',
        message: 'songs berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const respone = h.response({
          status: 'fail',
          message: error.message,
        });
        respone.code(error.statusCode);
        return respone;
      }
      const respone = h.response({
        status: 'error',
        message: error.message,
      });
      respone.code(500);
      return respone;
    }
  }
}

module.exports = SongsHandler;
