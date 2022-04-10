require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const albums = require('./api/albums');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const playlistSongs = require('./api/playlistSongs');
const songs = require('./api/songs');
const users = require('./api/users');
const AlbumsServices = require('./service/postgres/AlbumsServices');
const AuthenticationsServices = require('./service/postgres/AuthenticationsServices');
const PlaylistSongsService = require('./service/postgres/PlaylistSongsServices');
const PlaylistsServices = require('./service/postgres/PlaylistsServices');
const SongsServices = require('./service/postgres/SongsServices');
const UsersServices = require('./service/postgres/UsersServices');
const TokenManager = require('./tokenize/TokenManager');
const AlbumValidator = require('./validator/albums');
const AuthenticationsValidator = require('./validator/authentications');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistSongsValidator = require('./validator/playlistSongs');
const SongValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');

const init = async () => {
  const albumsService = new AlbumsServices();
  const songsService = new SongsServices();
  const usersService = new UsersServices();
  const authenticationsService = new AuthenticationsServices();
  const playlistService = new PlaylistsServices();
  const playlistSongsService = new PlaylistSongsService();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  await server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        playlistSongsService,
        playlistService,
        songsService,
        validator: PlaylistSongsValidator,
      },

    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`server runing at ${server.info.uri}`);
};

init();
