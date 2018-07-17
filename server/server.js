const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const port = process.env.PORT || 3001;
const LOL_KEY = 'RGAPI-92f43e69-acee-4ab5-9a32-a84c2a962a64';
const LOL_API = 'https://na1.api.riotgames.com/lol/';
const LOL_SUMMONER_ENDPOINT = 'summoner/v3/summoners/by-name/';
const LOL_MATCH_LIST_ENDPOINT = 'match/v3/matchlists/by-account/';
const LOL_MATCH_ENDPOINT = 'match/v3/matches/';
const LOL_CHAMP_ENDPOINT = 'static-data/v3/champions/';
const NUM_MATCHES = 5;

app.use(bodyParser.json());

const getItems = (data, filter) => {
  let key, keys = [];
  for (key in data) {
    if (data.hasOwnProperty(key) && filter.test(key)) {
      keys.push(data[key])
    }
  }
  return keys;
}

const processData = (data, name) => {

  let playerIdObj = data.participantIdentities.filter(participant => participant.player.summonerName.toLowerCase() === name.toLowerCase() )[0];
  let ID = playerIdObj.participantId;
  let player = data.participants.filter( participant => participant.participantId === ID )[0];
  let champion = player.championId;
  let items = getItems(player.stats, /item/);

  let retData = {
    gameId: data.gameId,
    duration: data.gameDuration,
    win: player.stats.win,
    kills: player.stats.kills,
    deaths: player.stats.deaths,
    assists: player.stats.assists,
    level: player.stats.champLevel,
    minionKills: player.stats.totalMinionsKilled,
    champion: champion,
    items: items,
    spell1: player.spell1Id,
    spell2: player.spell2Id
  }

  console.log("RET", retData)

  return retData;


  /*

  HTTP Error 429 (Too many requests) at this point...

  return axios.get(`${LOL_API}${LOL_CHAMP_ENDPOINT}${player.championId}?api_key=${LOL_KEY}&locale=en_US`)
  .then(data => {
    console.log("getting the gott")
    retData.champion = data.data.name;
    return retData;
  })
  .catch(err => {
    console.log("WHY ERROR", err)
    return 'error getting champion';
  })
  */
}

// What a mess!
app.get('/api/summoner/:summoner', (req, res) => {
  console.log("SUMMONER ENDPOINT HIT");
  let summoner = req.params.summoner;
  // Get Summoner Info
  axios.get(`${LOL_API}${LOL_SUMMONER_ENDPOINT}${summoner}?api_key=${LOL_KEY}`)
  .then(data => {
    let accountId = data.data.accountId;
    console.log('ACCOUNT: ', accountId);
    // Get Match History for IDs
    return axios.get(`${LOL_API}${LOL_MATCH_LIST_ENDPOINT}${accountId}?api_key=${LOL_KEY}&endIndex=${NUM_MATCHES}`)
    .then(matchList => {
      console.log("MATCHES:", matchList.data.matches);
      // Get Data for Matches
      Promise.all(matchList.data.matches.map(match => {
        return axios.get(`${LOL_API}${LOL_MATCH_ENDPOINT}${match.gameId}?api_key=${LOL_KEY}`)
        .then(matchData => {
          console.log("GOT MATCH DATA!:", matchData.data);
          return processData(matchData.data, summoner);
        })
        .catch(err => {
          throw new Error(err);
        })
      }))
      .then(finalData => {
        console.log("FINALLY:", finalData);
        res.status(200).json(finalData);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    })
    .catch(err => {
      console.log('ERROR FINDING MATCH', err);
      res.status(500).json({ error: err });
    })
  })
  .catch(err => {
    console.log("IT'S AN ERROR", err);
    res.status(500).json({ error: err });
  });
})

const server = app.listen(port, () => {

  let serverHost = server.address().address;
  let serverPort = server.address().port;

  console.log(`App listening at http://${serverHost}:${serverPort}`)

})