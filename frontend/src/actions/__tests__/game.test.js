import * as gameActions from "../game";

describe("game action creators", () => {
  it("createGame", () => {
    expect(gameActions.createGame()).toMatchSnapshot();
  });
  it("gameCreated", () => {
    expect(gameActions.gameCreated(123)).toMatchSnapshot();
  });
  it("joinGame", () => {
    expect(gameActions.joinGame(123)).toMatchSnapshot();
  });
  it("addWord", () => {
    expect(
      gameActions.addWord({
        id: 0,
        word: "asdf",
        path: [0, 1, 2, 3],
        valid: true
      })
    ).toMatchSnapshot();
  });
  it("updateWord", () => {
    expect(
      gameActions.updateWord({ id: 2, valid: false, score: 34 })
    ).toMatchSnapshot();
  });
  it("completeWord", () => {
    expect(
      gameActions.completeWord({ word: "asdf", path: [1, 2, 3, 4] })
    ).toMatchSnapshot();
  });
  /** doesn't take an id? */
  it("startGame", () => {
    expect(gameActions.startGame()).toMatchSnapshot();
  });
  it("startCountdown", () => {
    expect(gameActions.startCountdown(3)).toMatchSnapshot();
  });
  it("leaveGame", () => {
    expect(gameActions.leaveGame(123)).toMatchSnapshot();
  });
  /** no id? */
  it("endGame", () => {
    expect(gameActions.endGame()).toMatchSnapshot();
  });
  it("rejoined", () => {
    expect(gameActions.rejoined(15)).toMatchSnapshot();
  });
  it("updateGameState", () => {
    expect(
      gameActions.updateGameState({
        started: true,
        users: [{ id: 2, nickname: "Eric" }]
      })
    ).toMatchSnapshot();
  });
});
