Game {
  board: [String],
  startTime: Date,
  endTime: Date,
  playerData: {
    userid: {
    words: [{word: String, valid: Bool}],
      score: Int
    },
  }
}

User {
  username: String,
  games: [Game],
}
