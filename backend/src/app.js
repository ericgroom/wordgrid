require("dotenv").config();
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const jwt = require("jsonwebtoken");
const corsMiddleware = require("./corsMiddleware");
const { generateBoard } = require("./utils");
const { validateWord, getTrie } = require("./words");
const db = require("./queries");
const handlers = require("./eventHandlers");

db.setup().then(() => {
  console.log("Database setup complete");
});

app.use(corsMiddleware);

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
  socket.on("chat message", async function(message) {
    console.log(`${socket.id} sends message: ${message}`);
    await handlers.onChatMessage(io, socket, message);
  });
});

getTrie()
  .then(trie => {
    console.log("trie read successfully");
    io.of("/game").on("connection", async function(socket) {
      console.log("user connected to /game");
      socket.on("join game", async ({ id }) => {
        console.log(`${socket.id} joins game: ${id}`);
        await handlers.onGameJoin(io, socket, id);
      });
      socket.on("word", async ({ word, wordId, gameId }) => {
        console.log(`${socket.id} plays word: ${word} in game: ${gameId}`);
        await handlers.onWordSubmitted(
          io,
          socket,
          trie,
          { word, id: wordId },
          gameId
        );
      });
      socket.on("game start", async ({ id }) => {
        console.log(`${socket.id} starts game: ${id}`);
        handlers.onGameStart(io, socket, id);
      });
      socket.on("nickname", async nickname => {
        console.log(`${socket.id} changes nickname to: ${nickname}`);
        await handlers.onNicknameChange(socket, nickname);
      });
      socket.on("auth", async token => {
        console.log(`${socket.id} authenticates: existing user`);
        await handlers.onAuthentication(socket, token);
      });
      socket.on("new auth", async () => {
        console.log(`${socket.id} authenticates: new anonymous user`);
        await handlers.onAuthenticateAnonymous(socket);
      });
    });
  })
  .catch(err => console.error("unable to create trie", err));

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
