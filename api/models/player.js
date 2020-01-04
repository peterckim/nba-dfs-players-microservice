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
    // The name of the model. The model will be stored in `sequelize.models` under this name.
    // This defaults to class name i.e. Bar in this case. This will control name of auto-generated
    // foreignKey and association naming
    modelName: "player",
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // define the table's name
    tableName: "players",
    // Sequelize instance
    sequelize: db
  }
);

Player.hasMany(Game);

module.exports = Player;
