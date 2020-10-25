require('dotenv').config();
const { Client } = require('pg');

const getDbPassword = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.DB_PASSWORD_PROD;
  } else {
    return process.env.DB_PASSWORD;
  }
}
const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: getDbPassword(),
  port: process.env.DB_PORT
});
client.connect();


module.exports = client;