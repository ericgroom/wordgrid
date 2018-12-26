const utils = require("../utils");
const _ = require("lodash");

describe("generateBoardFrequencies", () => {
  it("returns proper type", () => {
    const board = utils.generateBoardFrequencies();
    expect(Array.isArray(board)).toBe(true);
    expect(board.length).toBe(16);
  });
  it("generates different results each time", () => {
    const boards = _.times(10, () => utils.generateBoardFrequencies());
    const boardsSet = new Set(boards);
    expect(boards.length).toBe(boardsSet.size);
  });
});
