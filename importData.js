const db = require("./connect-mysql"); //
const player_data = require("./players.json");

// importData
player_data.forEach(async (data) => {
  const sql = `INSERT INTO players(
        name,
        team_acronym,
        team_name,
        games_played,
        minutes_per_game,
        field_goals_attempted_per_game,
        field_goals_made_per_game,
        field_goal_percentage,
        free_throw_percentage,
        three_point_attempted_per_game,
        three_point_made_per_game,
        three_point_percentage,
        points_per_game,
        offensive_rebounds_per_game,
        defensive_rebounds_per_game,
        rebounds_per_game,
        assists_per_game,
        steals_per_game,
        blocks_per_game,
        turnovers_per_game,
        player_efficiency_rating) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const [r] = await db.query(sql, [
    data.name,
    data.team_acronym,
    data.team_name,
    data.games_played,
    data.minutes_per_game,
    data.field_goals_attempted_per_game,
    data.field_goals_made_per_game,
    data.field_goal_percentage,
    data.free_throw_percentage,
    data.three_point_attempted_per_game,
    data.three_point_made_per_game,
    data.three_point_percentage,
    data.points_per_game,
    data.offensive_rebounds_per_game,
    data.defensive_rebounds_per_game,
    data.rebounds_per_game,
    data.assists_per_game,
    data.steals_per_game,
    data.blocks_per_game,
    data.turnovers_per_game,
    data.player_efficiency_rating,
  ]);
});
