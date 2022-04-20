const UserAlbumLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'userAlbumLikes',
  version: '1.0.0',
  register: async (server, { service }) => {
    const userAlbumLikeHandler = new UserAlbumLikeHandler(service);
    server.route(routes(userAlbumLikeHandler));
  },
};
