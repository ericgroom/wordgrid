const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const r = require("rethinkdb");

app.get("/", function(req, res) {
  res.send("<h1>hi</h1>");
});

r.connect({ db: "messages" }).then(c => {
  io.of("/chat").on("connection", function(socket) {
    console.log("a user connected");
    socket.on("chat message", function(message) {
      console.log(message);
      socket.emit("chat message", message);
      r.table("messages")
        .insert({ content: message })
        .run(c);
    });
    socket.on("disconnect", function() {
      console.log("a user disconnected");
    });
  });
});

r.connect({ db: "messages" }).then(c => {
  console.log("conntected to db");
  r.table("messages")
    .changes()
    .run(c)
    .then(cursor => {
      console.log("connected to messages changeset");
      cursor.each((err, message) => {
        console.log(message);
        io.of("/chat").emit("chat message", message.new_val.content);
      });
    });
});

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
