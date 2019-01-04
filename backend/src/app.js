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
    io.of("/game").on("connection", async function(socket) {
      console.log("user connected to /game");
      socket.on("join game", async ({ id }) => {
        console.log(`${socket.id} joins game: ${id}`);
        await handlers.onGameJoin(io, socket, id);
      });
      socket.on("word", async ({ word, wordId, gameId, path }) => {
        console.log(`${socket.id} plays word: ${word} in game: ${gameId}`);
        await handlers.onWordSubmitted(
          io,
          socket,
          trie,
          { word, id: wordId, path },
          gameId
        );
      });
      socket.on("game start", async ({ id }) => {
        const countdown = await handlers.startCountdown(io, socket, id);
        setTimeout(async () => {
          console.log(`${socket.id} starts game: ${id}`);
          await handlers.onGameStart(io, socket, id);
        }, countdown * 1000);
      });
      socket.on("nickname", async nickname => {
        console.log(`${socket.id} changes nickname to: ${nickname}`);
        await handlers.onNicknameChange(socket, nickname);
      });
      socket.on("auth", async (token, fn) => {
        console.log(`${socket.id} authenticates: existing user`);
        const success = await handlers.onAuthentication(socket, token);
        fn(success);
      });
      socket.on("new auth", async fn => {
        console.log(`${socket.id} authenticates: new anonymous user`);
        const success = await handlers.onAuthenticateAnonymous(socket);
        fn(success);
      });
      socket.on("leave game", gameId => {
        console.log(`socket ${socket.id} leaves game: ${gameId}`);
        socket.leave(gameId);
      });
      socket.on("chat message", async ({ message, gameId }) => {
        console.log(`${socket.id} sends message: ${message}`);
        await handlers.onChatMessage(io, socket, message, gameId);
      });
    });
  })
  .catch(err => console.error("unable to create trie", err));

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
