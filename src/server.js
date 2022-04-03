require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsServices = require('./service/postgres/AlbumsServices');
const AlbumValidator = require('./validator/albums');

const init = async () => {
  const albumsService = new AlbumsServices();
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumValidator,
    },
  });

  await server.start();
  console.log(`server runing at ${server.info.uri}`);
};

init();
