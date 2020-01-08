const express = require("express");
const router = express.Router();
const Player = require("../models/player");
const Game = require("../models/game");

/**
 * @GET Request
 * Player Show Route
 * Optional Params: opponent
 * URL: /players/:playerID
 *
 */
router.get("/:playerID", async (req, res) => {
  const playerid = req.params.playerID;
  const opponent = req.query.opponent;

  if (opponent) {
    try {
      const player = await Player.findByPk(playerid, {
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

      if (player) {
        const { id, name, position, games } = player;

        res.status(200).json({
          id,
          name,
          position,
          games
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID"
        });
      }
    } catch (err) {
      res.status(500).json({
        error: {
          err
        }
      });
    }
  } else {
    try {
      const player = await Player.findByPk(playerid, {
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

      if (player) {
        const { id, name, position, games } = player;

        res.status(200).json({
          id,
          name,
          position,
          games
        });
      } else {
        res.status(404).json({
          message: `Player with id = ${playerid} does not exist`
        });
      }
    } catch (err) {
      res.status(500).json({
        error: {
          err
        }
      });
    }
  }
});

/**
 * @GET Request
 * Player Index Route
 * URL: /players
 *
 */
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
