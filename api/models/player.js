const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const db = require("../sequelize");
const Game = require("./game");

class Player extends Model {}
Player.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    position: Sequelize.STRING
  },
  {
    modelName: "player",
    timestamps: false,
    tableName: "players",
    sequelize: db
  }
);

Player.hasMany(Game);

module.exports = Player;
