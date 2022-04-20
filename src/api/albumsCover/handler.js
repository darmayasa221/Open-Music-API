const ClientError = require('../../exceptions/ClientError');

class AlbumsCoverHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._validator = validator;
    this._albumsService = albumsService;
    this.postAlbumsCoverHandler = this.postAlbumsCoverHandler.bind(this);
  }

  async postAlbumsCoverHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;
      this._validator.validateAlbumsCover(cover.hapi.headers);

      const fileName = await this._service.writeFile(cover, cover.hapi);
      await this._albumsService.editCoverAlbum(fileName, id);
      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
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

module.exports = AlbumsCoverHandler;
