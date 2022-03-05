require("dotenv").config();

// === 套件使用 =========================================
const express = require("express"); // 引入express
const cors = require("cors"); // CORS
const db = require("./connect-mysql"); //
const data = require("./players.json");

const app = express();

// === middle-ware  ====================================
const corsOptions = {
  // 協助拿到cookie資料
  credentials: true,
  origin: (origin, cb) => {
    console.log(`origin:${origin}`);
    cb(null, true);
  },
};
app.use(cors(corsOptions));

// === 路由定義 =========================================

// 1. getData API
app.get("/player-list", async (req, res) => {
  let page = req.query.page || 1;
  let team = req.query.team;
  let keyword = req.query.keyword;
  let sortItem = req.query.sortItem;
  let sortBy = req.query.sortBy;

  let output = {};

  // 搜尋條件
  const perPage = 15;
  let limit = ` LIMIT ${(page - 1) * 15},${perPage}`;

  let where = "WHERE 1 ";
  let ORDER = 'ORDER BY points_per_game DESC'
  if (team) {
    where += `AND team_name = '${team}'`;
  }
  if (keyword) {
    where += `AND name LIKE '${keyword}%'`;
  }
  if(sortItem){
    ORDER = ` ORDER BY ${sortItem} DESC`
  }
  // 全部符合的資料
  const sql1 = `SELECT * FROM players ${where} `;
  const [r1] = await db.query(sql1);

  // 顯示的15筆資料
  const sql2 = `SELECT * FROM players ${where} ${ORDER} ${limit} `;
  const [r2] = await db.query(sql2);

  // get total row
  const sql3 = `SELECT COUNT(1) FROM players ${where}`;
  const [[r3]] = await db.query(sql3);

  const totalRows = r3["COUNT(1)"];
  const totalPages =
    totalRows / perPage < 1 ? 1 : Math.ceil(totalRows / perPage);
  output = {
    totalRows: totalRows,
    totalPages: totalPages,
    allData: r1,
    limitData: r2,
  };
  res.send(output);
});

// 2. player-details API
app.get('/player-list/:sid',async(req,res)=>{
  const sid = req.params.sid
  // console.log(sid)

  const sql = `SELECT * FROM players WHERE sid = '${sid}'`
  const [r] = await db.query(sql)

  if(r.affectedRows !==0){
    res.send(r)
  }
  // console.log(r)
})

// 3. team-chart API
app.get('/team-chart',async(req,res)=>{
  const sql = `SELECT team_acronym , COUNT(1) as teamSize FROM players GROUP BY team_acronym`
  const [r] = await db.query(sql)

  res.send(r)
})



// === port 設定 =========================================
let port = process.env.PORT;
app.listen(port, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`啟動: ${port}`, Date.now());
  console.log(`website is on: http://localhost:${port}/`);
});
