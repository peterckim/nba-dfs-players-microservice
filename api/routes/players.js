const express = require("express");
const router = express.Router();
const redis = require("redis");
const PlayerService = require("../services/player-service");

const client = redis.createClient(6379);

/**
 * @GET Request
 * @route   Player Show Route
 * @params  playerID
 * @query   opponent
 * @url     /players/:playerID
 *
 */
router.get("/:playerID", async (req, res) => {
  try {
    const playerid = req.params.playerID;
    const opponent = req.query.opponent;
    const player = await PlayerService.findPlayerById(playerid, opponent);

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

    const players = await PlayerService.getAllPlayers(offset, limit);

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
router.post("/:playerID", async (req, res) => {
  try {
    const gameData = {
      playerId: req.params.playerID,
      date: req.body.date,
      opponent: req.body.opponent,
      price: req.body.price,
      points: req.body.points,
      rebounds: req.body.rebounds,
      assists: req.body.assists,
      steals: req.body.steals,
      blocks: req.body.blocks,
      turnovers: req.body.turnovers
    };

    const game = PlayerService.addGameToPlayer(gameData);
    res.status(201).json(game);
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
 * @url     /players
 *
 */
router.post("/", async (req, res) => {
  try {
    const playerData = {
      name: req.body.name,
      position: req.body.position
    };

    const player = await PlayerService.addPlayer(playerData);

    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({
      err
    });
  }
});

module.exports = router;
