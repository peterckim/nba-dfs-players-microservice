const express = require("express");
const router = express.Router();
const PlayerService = require("../services/player-service");

/**
 * @GET Request
 * @route   Player Show Route
 * @params  playerID
 * @query   opponent
 * @url     /players/:playerID
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
 * @url     /players
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
 */
router.post("/:playerID", async (req, res) => {
  try {
    const {
      date,
      opponent,
      price,
      points,
      rebounds,
      assists,
      steals,
      blocks,
      turnovers
    } = req.body;

    const gameData = {
      playerId: req.params.playerID,
      date,
      opponent,
      price,
      points,
      rebounds,
      assists,
      steals,
      blocks,
      turnovers
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
 * @url     /players
 */
router.post("/", async (req, res) => {
  try {
    const { name, position } = req.body;

    const playerData = {
      name,
      position
    };

    const player = await PlayerService.addPlayer(playerData);

    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({
      err
    });
  }
});

/**
 * @PATCH Request
 * @route   Player Patch Route
 * @params  playerID
 * @url     /players/:playerID
 */
router.patch("/:playerID", async (req, res) => {
  try {
    const id = req.params.playerID;
    const { name, position } = req.body;

    const playerData = {
      name,
      position
    };

    const player = await PlayerService.updatePlayer(id, playerData);

    if (player > 0) {
      res.status(200).json({
        message: `player with id ${id} succesfully updated`
      });
    } else {
      res.status(400).json({
        message: "player update unsuccesful"
      });
    }
  } catch (err) {
    res.status(500).json({
      err
    });
  }
});

/**
 * @DELETE Request
 * @route   Player Delete Route
 * @params  playerID
 * @url     /players/:playerID
 */
router.delete("/:playerID", async (req, res) => {
  try {
    const id = req.params.playerID;

    const player = await PlayerService.deletePlayer(id);

    if (player > 0) {
      res.status(200).json({
        message: `player with id ${id} succesfully deleted`
      });
    } else {
      res.status(400).json({
        message: "player deletion unsuccesful"
      });
    }
  } catch (err) {
    res.status(500).json({
      err
    });
  }
});

module.exports = router;
