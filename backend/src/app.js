require("dotenv").config();
const app = require("express")();
const http = require("http").Server(app);
const corsMiddleware = require("./corsMiddleware");
const { getTrie } = require("./words");
const db = require("./queries");
const { createServer, attachListeners } = require("./socketServer");
const gameRouter = require("./routes/game");

const FRONTEND_URL = "https://wordgrid.app";
app.use(corsMiddleware(process.env.NODE_ENV === "production" && FRONTEND_URL));
app.use(gameRouter);

db.setupDB();

getTrie()
  .then(trie => {
    console.log("trie read successfully");
    const io = createServer(http);
    if (process.env.NODE_ENV === "production") {
      io.origins(FRONTEND_URL);
    }
    attachListeners(io, trie);
  })
  .catch(err => console.error("unable to create trie", err));

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
