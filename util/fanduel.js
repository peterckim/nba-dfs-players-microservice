const fs = require("fs");
const Player = require("../api/models/player");
const Game = require("../api/models/game");

readFanduelCSV = fileLocation => {
  fs.readFile(fileLocation, storeData);
};

storeData = (error, data) => {
  const arrayOfData = data
    .toString()
    .replace(/['"]+/g, "")
    .split("\n");
  const keys = arrayOfData[0].split(",");

  createPlayers(arrayOfData, keys);
};

createPlayers = (data, keys) => {
  let players = [];

  for (let i = 1; i < data.length; i++) {
    let playerData = data[i].split(",");
    let player = {};

    keys.forEach((el, i) => {
      player[el] = playerData[i];
    });

    players.push(player);
  }

  displayPlayers(players);
  // actionDelegate(players, "createGame");
};

displayPlayers = players => {
  console.log(players);
};

actionDelegate = (players, action) => {
  players.forEach(el =>
    action == "createGame"
      ? createGameAndAddToDB(el)
      : updatePlayerPositionToDB(el)
  );
};

findPlayer = player => {
  return Player.findOne({
    where: {
      name: `${player["First Name"]} ${player["Last Name"]}`
    }
  });
};

async function createGameAndAddToDB(player) {
  const row = await findPlayer(player);

  Game.create({
    playerId: row.id,
    date: Date.now(),
    price: parseInt(player.Salary),
    opponent: player.Opponent
  });
}

async function updatePlayerPositionToDB(player) {
  const row = await findPlayer(player);

  if (row.position == null) {
    row.position = `${player["Position"]}`;
    row.save({ fields: ["position"] });
  }
}

readFanduelCSV("./data/FanDuel-NBA-2020-01-04-42354-players-list.csv");

/* Knapsack Problem */
/* Weight = Salary */
/* Value = FPPG */
/* W = 60000 */

// knapSack = (W, players, n) => {
//   if (n == 0 || W == 0) {
//     return 0;
//   }
//   if (parseInt(players[n - 1].Salary) > W) {
//     return knapSack(W, players, n - 1);
//   } else {
//     return Math.max(
//       parseFloat(players[n - 1].FPPG) +
//       knapSack(W - parseInt(players[n - 1].Salary), players, n - 1),
//       knapSack(W, players, n - 1)
//     );
//   }
// };
