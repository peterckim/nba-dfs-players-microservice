const Sequelize = require("sequelize");
const keys = require("../config/config");

/* Connect to MS SQL Server db */
const sequelize = new Sequelize(keys.db, keys.user, keys.password, {
  host: keys.host,
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true
    }
  }
});

// const sequelize = new Sequelize(
//   process.env.DATABASE,
//   process.env.USER,
//   process.env.PASSWORD,
//   {
//     host: process.env.HOST,
//     dialect: "mssql",
//     dialectOptions: {
//       options: {
//         encrypt: true
//       }
//     }
//   }
// );

module.exports = sequelize;
