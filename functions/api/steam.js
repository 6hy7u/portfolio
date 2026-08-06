const currentResponse = await fetch(
  `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
);

const recentResponse = await fetch(
  `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${steamId}&count=1&format=json`
);

const currentData = await currentResponse.json();
const recentData = await recentResponse.json();

const player = currentData.response.players[0];

return new Response(
  JSON.stringify(player, null, 2),
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
);

if (player?.gameid) {
  return new Response(
    JSON.stringify({
      playing: true,
      appid: player.gameid,
      name: player.gameextrainfo,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

const game = recentData.response.games?.[0];

return new Response(
  JSON.stringify({
    playing: false,
    game,
  }),
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);