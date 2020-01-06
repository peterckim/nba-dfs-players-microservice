const fs = require("fs");
const Player = require("../api/models/player");
const Game = require("../api/models/game");

/* Read the CSV File */
readFanduelCSV = fileLocation => {
  fs.readFile(fileLocation, storeData);
};

/* Parse the Input Data */
storeData = (error, data) => {
  const arrayOfData = data
    .toString()
    .replace(/['"]+/g, "")
    .split("\n");
  const keys = arrayOfData[0].split(",");

  /* Create Players */
  createPlayers(arrayOfData, keys);
};

/* Create Player Objects */
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

  /* Create New Game Objects or Update Player Position */
  actionDelegate(players, "updatePosition");
  actionDelegate(players, "createGame");
};

/* Simple Function to Display Players in the Console */
displayPlayers = players => {
  console.log(players);
};

/* Loop through all the players, then either create game or update position */
actionDelegate = (players, action) => {
  players.forEach(el =>
    action == "createGame"
      ? createGameAndAddToDB(el)
      : updatePlayerPositionToDB(el)
  );
};

/* Retrieve player entry from Database */
findPlayer = player => {
  return Player.findOne({
    where: {
      name: `${player["First Name"]} ${player["Last Name"]}`
    }
  });
};

/* Create a Game Object from CSV Data and Insert into database */
async function createGameAndAddToDB(player) {
  const row = await findPlayer(player);

  Game.create({
    playerId: row.id,
    date: Date.now(),
    price: parseInt(player.Salary),
    opponent: player.Opponent
  });
}

/* Update Player's Position from CSV Data and Insert into database */
async function updatePlayerPositionToDB(player) {
  const row = await findPlayer(player);

  if (row.position == null) {
    row.position = `${player["Position"]}`;
    row.save({ fields: ["position"] });
  }
}

readFanduelCSV("./data/FanDuel-NBA-2020-01-06-42412-players-list.csv");
