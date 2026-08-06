export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const steamId = url.searchParams.get("steamid");

  if (!steamId) {
    return Response.json(
      { error: "Missing Steam ID" },
      { status: 400 }
    );
  }

  const apiKey = env.STEAM_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Missing API key" },
      { status: 500 }
    );
  }

  try {
    const currentResponse = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
    );

    const recentResponse = await fetch(
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${steamId}&count=10&format=json`
    );

    const currentData = await currentResponse.json();
    const recentData = await recentResponse.json();

    const player = currentData.response.players?.[0];

    // Currently playing
    if (player?.gameid) {
      return Response.json({
        playing: true,
        appid: player.gameid,
        name: player.gameextrainfo,
      });
    }

    // Recently played (ignore Spacewar)
    const games = recentData.response.games?.filter(
  (game) => game.appid !== 480
    );

const game = games?.[0];

    if (game) {
      return Response.json({
        playing: false,
        game: {
          name: game.name,
          appid: game.appid,
          playtime_2weeks: game.playtime_2weeks,
          img_icon_url: game.img_icon_url,
        },
      });
    }

    return Response.json({
      playing: false,
      game: null,
    });

  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}