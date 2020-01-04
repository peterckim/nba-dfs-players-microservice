const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const db = require("../sequelize");

class Game extends Model {}
Game.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: Sequelize.DATEONLY,
    opponent: Sequelize.STRING,
    price: Sequelize.INTEGER,
    points: Sequelize.INTEGER,
    rebounds: Sequelize.INTEGER,
    assists: Sequelize.INTEGER,
    steals: Sequelize.INTEGER,
    blocks: Sequelize.INTEGER,
    turnovers: Sequelize.INTEGER
  },
  {
    modelName: "game",
    timestamps: false,
    tableName: "games",
    sequelize: db
  }
);

module.exports = Game;
