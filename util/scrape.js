const request = require("request");
const cheerio = require("cheerio");

const Player = require("../api/models/player");
const Game = require("../api/models/game");

var baseUrl = "https://www.basketball-reference.com";
var month = "january";
var year = "2020";

/* Obtain Individual Game Links from Main Page */
makeInitialRequest = (month, year) => {
  request(
    `${baseUrl}/leagues/NBA_${year}_games-${month}.html`,
    obtainGameLinks
  );
};

obtainGameLinks = (error, response, html) => {
  let gameLinks = [];
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    $("td[data-stat=box_score_text]")
      .children("a")
      .each(function(i, elem) {
        gameLinks.push(`${baseUrl}${elem.attribs.href}`);
      });
  }

  openIndividualGameLinks(gameLinks);
};

openIndividualGameLinks = gameLinks => {
  gameLinks.forEach(link => openLink(link));
};

openLink = gameLink => {
  request(`${gameLink}`, obtainGameData);
};

obtainGameData = (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    const date = obtainGameDate($);

    const tables = obtainTables($);

    handlePlayers($, tables, date);

    // console.log(playerRow);
    // $
  }
};

async function findPlayerInDB($, name, date, stats) {
  const player = await findPlayerByName(name);

  findGameInDB($, player, date, stats);
}

async function findGameInDB($, player, date, stats) {
  const game = await findGame(player, date);

  // console.log(game);
  updateStatistics($, game, stats);
}

updateStatistics = ($, game, stats) => {
  if (game.points == null) {
    game.points = stats.pts;
    game.rebounds = stats.rebs;
    game.assists = stats.asts;
    game.steals = stats.stls;
    game.blocks = stats.blks;
    game.turnovers = stats.tos;
    game.save({
      fields: ["points", "rebounds", "assists", "steals", "blocks", "turnovers"]
    });
  }
};

updatePlayers = ($, rows, date) => {
  let playerNames = [];
  rows.each(function(i, elem) {
    const name = $(elem)
      .find("th")
      .first()
      .text()
      .replace("č", "c")
      .replace("ć", "c")
      .replace("č", "c")
      .replace("ū", "u")
      .replace("ā", "a")
      .replace("ņ", "n")
      .replace("ģ", "g")
      .replace("İ", "I")
      .replace("Č", "C");

    const pts = $(elem)
      .find("td[data-stat=pts]")
      .first()
      .text();
    const rebs = $(elem)
      .find("td[data-stat=trb]")
      .first()
      .text();
    const asts = $(elem)
      .find("td[data-stat=ast]")
      .first()
      .text();
    const stls = $(elem)
      .find("td[data-stat=stl]")
      .first()
      .text();
    const blks = $(elem)
      .find("td[data-stat=blk]")
      .first()
      .text();
    const tos = $(elem)
      .find("td[data-stat=tov]")
      .first()
      .text();

    const stats = {
      pts,
      rebs,
      asts,
      stls,
      blks,
      tos
    };
    // console.log(stats);

    findPlayerInDB($, name, date, stats);

    // const player = await findPlayerByName(name);
    // console.log(player);
    // const date = Date.now();
    // const game = findGame(player, date);
    //
  });
};

findGame = (player, date) => {
  return Game.findOne({
    where: {
      playerId: `${player.id}`,
      date: `${date}`
    }
  });
};

findPlayerByName = name => {
  return Player.findOne({
    where: {
      name: `${name}`
    }
  });
};

handlePlayers = ($, tables, date) => {
  const playerRow = tables
    .find("tbody")
    .find("tr")
    .filter(function(i, el) {
      return $(this).attr("class") != "thead";
    })
    .filter(function(i, el) {
      return $(this).find("td[data-stat=reason]").length == 0;
    });

  updatePlayers($, playerRow, date);
};

obtainTables = $ => {
  const tables = $("table").filter(function(i, el) {
    return $(this)
      .attr("id")
      .match(/game-basic$/);
  });

  return tables;
};

obtainGameDate = $ => {
  const date = $("div.scorebox_meta")
    .find("div")
    .first()
    .text();

  const dateArray = date.split(", ");
  const monthDay = dateArray[1].split(" ");
  let monthNumber = 0;

  switch (monthDay[0]) {
    case "January":
      monthNumber = 0;
      break;
    case "February":
      monthNumber = 1;
      break;
    case "March":
      monthNumber = 2;
      break;
    case "April":
      monthNumber = 3;
      break;
    case "May":
      monthNumber = 4;
      break;
    case "June":
      monthNumber = 5;
      break;
    case "July":
      monthNumber = 6;
      break;
    case "August":
      monthNumber = 7;
      break;
    case "September":
      monthNumber = 8;
      break;
    case "October":
      monthNumber = 9;
      break;
    case "November":
      monthNumber = 10;
      break;
    case "December":
      monthNumber = 11;
      break;
    default:
      monthNumber = 0;
  }

  // console.log(dateArray[2]);
  // console.log(monthDay[0]);
  // console.log(monthDay[1]);

  const dateObject = new Date(dateArray[2], monthNumber, monthDay[1]);
  // console.log(dateObject);

  return dateObject;
};

makeInitialRequest(month, year);
