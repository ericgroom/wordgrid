const _ = require("lodash");
const utils = require("../board");

describe("generateBoardFrequencies", () => {
  it("returns proper type", () => {
    const board = utils.generateBoard();
    expect(Array.isArray(board)).toBe(true);
    expect(board.length).toBe(16);
  });
  it("generates different results each time", () => {
    const boards = _.times(10, () => utils.generateBoard());
    const boardsSet = new Set(boards);
    expect(boards.length).toBe(boardsSet.size);
  });
});
