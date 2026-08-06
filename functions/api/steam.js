export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const steamId = url.searchParams.get("steamid");

  if (!steamId) {
    return new Response(
      JSON.stringify({ error: "Missing Steam ID" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const apiKey = env.STEAM_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing API key" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
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
      "Content-Type": "application/json",
    },
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}