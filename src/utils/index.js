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

module.exports = {
  generateId,
  remakeSongsStructure,
};
