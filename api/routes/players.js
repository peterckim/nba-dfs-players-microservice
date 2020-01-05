const express = require("express");
const router = express.Router();
const Player = require("../models/player");
const Game = require("../models/game");

router.get("/:playerID", (req, res) => {
  const id = req.params.playerID;
  const opponent = req.query.opponent;

  if (opponent) {
    Player.findByPk(id, {
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
    }).then(response => {
      res.status(200).json({
        id: response.id,
        name: response.name,
        position: response.position,
        games: response.games
      });
    });
  } else {
    Player.findByPk(id, {
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
    }).then(response => {
      res.status(200).json({
        id: response.id,
        name: response.name,
        position: response.position,
        games: response.games
      });
    });
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
            url: "http://localhost:5000/players/" + el.id
          }
        };
      })
    });
  });
});

router.post("/", (req, res) => {});

module.exports = router;
