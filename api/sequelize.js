const Sequelize = require("sequelize");
const keys = require("../config/config");

const sequelize = new Sequelize(keys.db, keys.user, keys.password, {
  host: keys.host,
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true
    }
  }
});

module.exports = sequelize;
