require("dotenv").config();
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const jwt = require("jsonwebtoken");
// const knex = require("knex")(require("../knexfile")[process.env.NODE_ENV]);
// const r = require("rethinkdb");
const { generateBoard } = require("./utils");
const { validateWord, getTrie } = require("./words");
const db = require("./queries");

db.setup().then(() => {
  console.log("Database setup complete");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/game/new", async function(req, res) {
  try {
    const result = await db.createGame({});
    const gameId = result.generated_keys[0];
    res.json({ gameId: gameId });
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
    io.of("/game").on("connection", async function(socket) {
      console.log("user connected to /game");
      socket.on("join game", async ({ id }) => {
        try {
          console.log(id);
          const game = await db.getGame(id);
          console.log(game);
          if (game) {
            socket.emit("state", game);
          } else {
            socket.emit("not exists");
          }
          socket.join(`${id}`);
          const cursor = await db.filterUsers({ socket_id: socket.id });
          const user = await cursor.next();
          const nickname = user.nickname;
          console.log(`${nickname} joining`);
          socket.broadcast.to(`${id}`).emit("user join", nickname);
        } catch (err) {
          console.log(err);
        }
      });
      socket.on("word", ({ word, wordId, gameId }) => {
        const { valid, score } = validateWord(word, trie);
        console.log(`${socket.id}: word ${word}, valid ${valid}`);
        // TODO will need to ascociate with user somehow
        io.of("/game")
          .to(`${gameId}`)
          .emit("word", { valid, id: wordId, score });
      });
      socket.on("nickname", async nickname => {
        console.log(`${socket.id} is now ${nickname}`);
        const cursor = await db.filterUsers({ socket_id: socket.id });
        const user = await cursor.next();
        await db.updateUser(user.id, { nickname });
        socket.emit("nickname", nickname);
      });
      socket.on("auth", async token => {
        console.log("auth");
        try {
          const { userId } = await jwt.verify(token, process.env.APP_SECRET);
          await db.updateUser(userId, { socket_id: socket.id });
          const userObj = await db.getUser(userId);
          socket.emit("nickname", userObj.nickname);
        } catch (e) {
          console.log(e);
        }
      });
      socket.on("new auth", async () => {
        console.log("new auth");
        try {
          const userObj = await db.createUser({ socket_id: socket.id });
          const userId = userObj.generated_keys[0];
          const token = await jwt.sign({ userId }, process.env.APP_SECRET);
          socket.emit("token", token);
        } catch (e) {
          console.error(e);
        }
      });
    });
  })
  .catch(err => console.error("unable to create trie", err));

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
