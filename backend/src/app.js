const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const knex = require("knex")(require("../knexfile")[process.env.NODE_ENV]);
const { generateBoard, getTrie, wordInTrie } = require("./utils");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/", function(req, res) {
  res.send("<h1>hi</h1>");
});

app.get("/game/new", async function(req, res) {
  try {
    const gameId = await knex("games")
      .returning("id")
      .insert({ grid: generateBoard().join("") });
    res.json({ gameId });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

io.of("/chat").on("connection", function(socket) {
  console.log("a user connected");
  socket.on("chat message", async function(message) {
    console.log(message);
    const messageId = await knex("messages")
      .returning("id")
      .insert({ message });
    io.of("/chat").emit("chat message", { message, id: messageId[0] });
  });
  socket.on("disconnect", function() {
    console.log("a user disconnected");
  });
});

getTrie()
  .then(trie => {
    console.log("trie read successfully");
    io.of("/game").on("connection", function(socket) {
      console.log("user connected to /game");
      socket.on("join game", async ({ id }) => {
        try {
          const game = await knex("games")
            .where("id", parseInt(id))
            .first()
            .select(["id", "grid"]);
          console.log(game);
          if (game) {
            socket.emit("state", game);
          } else {
            socket.emit("not exists");
          }
          socket.join(`${id}`);
        } catch (err) {
          console.log(err);
        }
      });
      socket.on("word", ({ word, wordId, gameId }) => {
        const inTrie = wordInTrie(word, trie);
        const large = word.length >= 3;
        const valid = inTrie && large;
        const score = valid ? word.length * 10 : 0;
        console.log(`${socket.id}: word ${word}, valid ${valid}`);
        // TODO will need to ascociate with user somehow
        io.of("/game")
          .to(`${gameId}`)
          .emit("word", { valid, id: wordId, score });
      });
    });
  })
  .catch(err => console.error("unable to create trie", err));

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
