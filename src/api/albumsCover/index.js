const AlbumsCoverHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumsCover',
  version: '1.0.0',
  register: async (server, { service, albumsService, validator }) => {
    const albumsCoverHandler = new AlbumsCoverHandler(service, albumsService, validator);
    server.route(routes(albumsCoverHandler));
  },
};
