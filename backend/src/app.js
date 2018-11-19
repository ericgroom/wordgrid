const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const r = require("rethinkdb");

app.get("/", function(req, res) {
  res.send("<h1>hi</h1>");
});

r.connect({ db: "wordgrid" }).then(c => {
  io.of("/chat").on("connection", function(socket) {
    console.log("a user connected");
    socket.on("chat message", async function(message) {
      console.log(message);
      io.of("/chat").emit("chat message", message);
      await r
        .table("messages")
        .insert({ content: message })
        .run(c);
    });
    socket.on("disconnect", function() {
      console.log("a user disconnected");
    });
  });
});

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
