require('dotenv').config();
const sql = require('mssql');
const { enable } = require('../app');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // Use your server name here
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
  },
  port: 1433,
};

module.exports = config;
