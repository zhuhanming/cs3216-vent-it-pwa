const bcrypt = require('bcryptjs');

const generateHashPassword = password => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const isSamePassword = (userPassword, databasePassword) => {
  return bcrypt.compareSync(userPassword, databasePassword);
}

module.exports = {
  generateHashPassword,
  isSamePassword
}