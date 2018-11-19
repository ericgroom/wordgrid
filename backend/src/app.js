const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const knex = require("knex")(require("../knexfile")[process.env.NODE_ENV]);

app.get("/", function(req, res) {
  res.send("<h1>hi</h1>");
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
