const Player = require("../models/player");
const Game = require("../models/game");

/**
 * Player Service
 */
const PlayerService = {
  /**
   * Method to grab player with id from database
   * @param {int} id
   * @param {String} opponent
   */
  findPlayerById: async function(id, opponent) {
    const player = opponent
      ? await Player.findByPk(playerid, {
          attributes: {
            exclude: ["timestamps"]
          },
          include: [
            {
              model: Game,
              where: {
                opponent: opponent
              },
              order: [["date", "DESC"]],
              attributes: [
                "id",
                "date",
                "price",
                "opponent",
                "points",
                "rebounds",
                "assists",
                "steals",
                "blocks",
                "turnovers"
              ]
            }
          ]
        })
      : await Player.findByPk(id, {
          attributes: {
            exclude: ["timestamps"]
          },
          include: [
            {
              model: Game,
              limit: 10,
              order: [["date", "DESC"]],
              attributes: [
                "id",
                "date",
                "price",
                "opponent",
                "points",
                "rebounds",
                "assists",
                "steals",
                "blocks",
                "turnovers"
              ]
            }
          ]
        });

    return player;
  },

  /**
   * Method to grab all players from database
   * @param {int} id
   * @param {String} opponent
   */
  getAllPlayers: async function(offset, limit) {
    const players = await Player.findAll({
      attributes: {
        exclude: ["timestamps"]
      },
      limit,
      offset
    });

    return players;
  },

  /**
   * Method to add player to database
   * @param {int} id
   * @param {String} opponent
   */
  addPlayer: async function(playerData) {
    const player = await Player.create(playerData);

    return player;
  },

  /**
   * Method to add game to player to database
   * @param {int} id
   * @param {String} opponent
   */
  addGameToPlayer: async function(gameData) {
    const game = await Game.create(gameData);

    return game;
  }
};

module.exports = PlayerService;
