const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistBySongHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistBySongsHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  }, {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylistBySongHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
