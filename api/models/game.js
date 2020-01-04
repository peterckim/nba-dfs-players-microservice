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
    // The name of the model. The model will be stored in `sequelize.models` under this name.
    // This defaults to class name i.e. Bar in this case. This will control name of auto-generated
    // foreignKey and association naming
    modelName: "game",
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // define the table's name
    tableName: "games",
    // Sequelize instance
    sequelize: db
  }
);

// Game.belongsTo(Player);

module.exports = Game;
