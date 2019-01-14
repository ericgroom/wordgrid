require("dotenv").config();
const app = require("express")();
const http = require("http").Server(app);
const corsMiddleware = require("./corsMiddleware");
const { getTrie } = require("./words");
const db = require("./queries");
const { createServer, attachListeners } = require("./socketServer");

app.use(corsMiddleware);

app.get("/game/new", async function(req, res) {
  try {
    const { id: gameId } = await db.createGame({});
    res.json({ gameId: gameId });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

getTrie()
  .then(trie => {
    console.log("trie read successfully");
    const io = createServer(http);
    attachListeners(io, trie);
  })
  .catch(err => console.error("unable to create trie", err));

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
