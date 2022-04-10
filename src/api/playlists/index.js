const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'palylists',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const palylistHandler = new PlaylistsHandler(service, validator);
    server.route(routes(palylistHandler));
  },
};
