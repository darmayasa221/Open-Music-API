const { Pool } = require('pg');

class PlaylistsServices {
  constructor() {
    this._pool = new Pool();
  }
}

module.exports = PlaylistsServices;
