const express = require("express");
const router = express.Router();
const Player = require("../models/player");
const Game = require("../models/game");

router.get("/:playerID", async (req, res) => {
  const id = req.params.playerID;
  const opponent = req.query.opponent;

  if (opponent) {
    try {
      const player = await Player.findByPk(id, {
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
      });

      res.status(200).json({
        id: player.id,
        name: player.name,
        position: player.position,
        games: player.games
      });
    } catch (err) {
      res.status(404).json({
        error: {
          message: "Player does not exist"
        }
      });
    }
  } else {
    try {
      const player = await Player.findByPk(id, {
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

      res.status(200).json({
        id: player.id,
        name: player.name,
        position: player.position,
        games: player.games
      });
    } catch (err) {
      res.status(400).json({
        error: {
          message: `Player with id = ${id} does not exist`
        }
      });
    }
  }
});

router.get("/", (req, res, next) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  const offset = page * size;
  const limit = size;

  Player.findAll({
    attributes: {
      exclude: ["timestamps"]
    },
    limit: limit,
    offset: offset
  }).then(response => {
    res.status(200).json({
      count: response.length,
      players: response.map(el => {
        return {
          id: el.id,
          name: el.name,
          position: el.position,
          request: {
            type: "GET",
            url: `${req.protocol}://${req.get("host")}/players/${el.id}`
          }
        };
      }),
      meta: {
        next: {
          request: {
            type: "GET",
            url: `${req.protocol}://${req.get("host")}/players?page=${page +
              1}&size=${size}`
          }
        }
      }
    });
  });
});

router.post("/", (req, res) => {});

module.exports = router;
