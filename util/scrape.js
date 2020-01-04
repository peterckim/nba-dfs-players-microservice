const request = require("request");
const cheerio = require("cheerio");

const Player = require("../api/models/player");
const Game = require("../api/models/game");

var baseUrl = "https://www.basketball-reference.com";
var month = "november";
var year = "2020";

/* Obtain Individual Game Links from Wrapper Site */
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

    handlePlayers($, tables);

    // console.log(playerRow);
    // $
  }
};

updatePlayers = rows => {
  let playerNames = [];
  console.log(rows.first().text());
  rows.each(function(i, elem) {
    playerNames.push(
      elem
        .find("th")
        .first()
        .text()
    );
  });

  let finalPlayerNames = playerNames.map(name => {
    return name
      .replace("č", "c")
      .replace("ć", "c")
      .replace("č", "c")
      .replace("ū", "u")
      .replace("ā", "a")
      .replace("ņ", "n")
      .replace("ģ", "g")
      .replace("İ", "I")
      .replace("Č", "C");
  });

  getPlayersFromDB(finalPlayerNames);
};

getPlayersFromDB = players => {
  players.forEach(p => {
    Player.findOne({
      where: {
        name: `${p}`
      }
    });
  });
};

handlePlayers = ($, tables) => {
  const playerRow = tables
    .find("tbody")
    .find("tr")
    .filter(function(i, el) {
      return $(this).attr("class") != "thead";
    });

  updatePlayers(playerRow);
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

  return date;
};

makeInitialRequest(month, year);
