const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const knex = require("knex")(require("../knexfile")[process.env.NODE_ENV]);

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
      .insert({});
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

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
