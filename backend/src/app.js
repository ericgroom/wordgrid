const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.send("<h1>hi</h1>");
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("chat message", function(message) {
    console.log(message);
    socket.emit("chat message", message);
  });
  socket.on("disconnect", function() {
    console.log("a user disconnected");
  });
});

const port = 3001;
http.listen(port, () => console.log(`app listenting on port ${port}`));
