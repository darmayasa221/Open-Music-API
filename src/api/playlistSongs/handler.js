const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistService, songsServices, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistService = playlistService;
    this._songsService = songsServices;
    this._validator = validator;

    this.postPlaylistBySongHandler = this.postPlaylistBySongHandler.bind(this);
    this.getPlaylistBySongsHandler = this.getPlaylistBySongsHandler.bind(this);
    this.deletePlaylistBySongHandler = this.deletePlaylistBySongHandler.bind(this);
  }

  async postPlaylistBySongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { userId: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.verifySong(songId);
      await this._playlistSongsService.addPlaylistSong(songId, playlistId);

      const response = h.response({
        status: 'success',
        message: 'song berhasil ditambahkan',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: error.message,
      });
      response.code(500);
      return response;
    }
  }

  async getPlaylistBySongsHandler(request, h) {
    try {
      const { userId: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._playlistSongsService.getPlaylistSong(playlistId);

      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: error.message,
      });
      response.code(500);
      return response;
    }
  }

  async deletePlaylistBySongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { userId: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      const { id: playlistId } = request.params;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongsService.deletePlaylistSong(songId, playlistId);

      return {
        status: 'success',
        message: 'songs berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: error.message,
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
