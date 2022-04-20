const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator, playlistService) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validatorExportPlaylistsPayload(request.payload);
      const { userId: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this._service.sendMessage(
        'export:playlist_songs',
        JSON.stringify(message),
      );
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
}

module.exports = ExportsHandler;
