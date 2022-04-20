const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikeHandler {
  constructor(services) {
    this._service = services;

    this.postUserAlbumLikesHandler = this.postUserAlbumLikesHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
  }

  async postUserAlbumLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { userId: credentialId } = request.auth.credentials;
      await this._service.verifyUserAlbumLike({ credentialId, albumId });

      const response = h.response({
        status: 'success',
        message: 'thank You',
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

  async getUserAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const likes = await this._service.getUserAlbumLike({ albumId });
    const likesNumber = JSON.parse(likes);
    if (typeof likes === 'string') {
      const response = h.response({
        status: 'success',
        data: {
          likes: likesNumber,
        },
      });
      response.header('X-Data-Source', 'cache');
      response.code(200);
      return response;
    }
    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = UserAlbumLikeHandler;
