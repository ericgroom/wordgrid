const express = require("express");
const db = require("../queries/games");
const { encodeId } = require("../utils");

const router = express.Router();

router.get("/game/new", async function(req, res) {
  try {
    const { id: gameId } = await db.createGame({});
    res.json({ gameId: encodeId(gameId) });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
