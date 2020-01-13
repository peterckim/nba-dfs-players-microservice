const Player = require("../models/player");
const Game = require("../models/game");

const PlayerService = {
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

  addPlayer: async function(playerData) {
    const player = await Player.create(playerData);

    return player;
  },

  addGameToPlayer: async function(gameData) {
    const game = await Game.create(gameData);

    return game;
  }
};

module.exports = PlayerService;
