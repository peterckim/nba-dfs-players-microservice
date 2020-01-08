const express = require("express");
const router = express.Router();
const Player = require("../models/player");
const Game = require("../models/game");

/**
 * @GET Request
 * @route   Player Show Route
 * @params  playerID
 * @query   opponent
 * @url     /players/:playerID
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
          message: "No valid entry found for provided ID and opponent"
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
 * @route   Player Index Route
 * @url     /players/:playerID
 *
 */
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    const offset = page * size;
    const limit = size;

    const players = await Player.findAll({
      attributes: {
        exclude: ["timestamps"]
      },
      limit: limit,
      offset: offset
    });

    res.status(200).json({
      count: players.length,
      players: players.map(el => {
        const { id, name, position } = el;
        return {
          id,
          name,
          position,
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
  } catch (err) {
    res.status(500).json({
      err
    });
  }
});

/**
 * @POST Request
 * @route   Player Post Route
 * @params  playerID
 * @url     /players/:playerID
 *
 */
router.post("/:playerID", (req, res) => {});

module.exports = router;
