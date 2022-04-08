require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const AlbumsServices = require('./service/postgres/AlbumsServices');
const SongsServices = require('./service/postgres/SongsServices');
const UsersServices = require('./service/postgres/UsersServices');
const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');

const init = async () => {
  const albumsService = new AlbumsServices();
  const songsService = new SongsServices();
  const usersService = new UsersServices();
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
  ]);

  await server.start();
  console.log(`server runing at ${server.info.uri}`);
};

init();
