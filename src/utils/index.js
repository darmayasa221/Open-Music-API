/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const { nanoid } = require('nanoid');

const generateId = (item) => {
  let id = nanoid(14);
  id = `${item}-${id}`;
  return id;
};

const remakeSongsStructure = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const remakeAlbumStructure = ({ id, name, year, cover }) => ({
  id,
  name,
  year,
  coverUrl: cover,
});
const playlists = ({ id, name, username }) => ({
  id,
  name,
  username,
});

const songs = ({ song_id, title, performer }) => ({
  id: song_id,
  title,
  performer,
});
const uniqueValuePlaylistName = (firstValue, index, self) => self.findIndex((secondValue) => (secondValue.name === firstValue.name)) === index;
const uniqueValueSongTitle = (firstValue, index, self) => self.findIndex((secondValue) => (secondValue.title === firstValue.title)) === index;
const playlistSongsStructure = (playlistsSongs) => {
  const playlist = playlistsSongs.map(playlists);
  const song = playlistsSongs.map(songs).filter(uniqueValueSongTitle);
  return {
    ...playlist[0],
    songs: song,
  };
};

module.exports = {
  generateId,
  remakeSongsStructure,
  uniqueValuePlaylistName,
  playlistSongsStructure,
  remakeAlbumStructure,
};
