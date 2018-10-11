const app = require("express")();
const expressWs = require("express-ws")(app);

app.get("/", function(req, res) {
  res.send("<h1>hi</h1>");
});

app.ws("/game", function(ws, req) {
  ws.on("message", function(msg) {
    console.log(`recievied: ${msg}`);
    ws.send("Hello Client!");
  });
});

const port = 3001;
app.listen(port, () => console.log(`app listenting on port ${port}`));
