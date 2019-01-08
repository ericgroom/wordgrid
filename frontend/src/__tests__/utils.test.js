import {
  appendOrRevert,
  XYToIndex,
  indexToXY,
  bfs,
  gridNeighbors,
  extendAndReconcilePath
} from "../utils";

describe("appendOrRevert", () => {
  it("should append to an empty array", () => {
    const result = appendOrRevert([], 1);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(1);
  });
  it("should not modify original array", () => {
    const original = [1, 2, 3];
    const appended = appendOrRevert(original, 4);
    expect(original).not.toBe(appended);
    expect(original).toEqual([1, 2, 3]);
    expect(appended).toEqual([1, 2, 3, 4]);
  });
  it("should revert when the element already exists in array", () => {
    const result = appendOrRevert([5, 1, 2, 4], 1);
    expect(result.length).toBe(2);
    expect(result).toEqual([5, 1]);
  });
});

describe("XYToIndex", () => {
  it("works for happy path", () => {
    const coord = {
      x: 1,
      y: 1
    };
    const index = XYToIndex(coord, 3);
    expect(index).toBe(4);
  });
});

describe("IndexToXY", () => {
  it("works for happy path", () => {
    const index = 5;
    const { x, y } = indexToXY(index, 4);
    expect(x).toBe(1);
    expect(y).toBe(1);
  });
});

describe("IndexToXY <-> XYToIndex", () => {
  it("should be reversible", () => {
    const index = 7;
    const gridSize = 2;
    const coord = indexToXY(index, gridSize);
    const newIndex = XYToIndex(coord, gridSize);
    expect(index).toBe(newIndex);
  });
});

describe("grid neighbors", () => {
  it("shouldn't include negative numbers", () => {
    const neighbors = gridNeighbors(3)(2);
    const negativeCount = neighbors.filter(i => i < 0).length;
    expect(negativeCount).toBe(0);
  });
  it("shouldn't include numbers outside the range of the grid", () => {
    const neighbors = gridNeighbors(2)(1);
    // order is not guaranteed which is why we sort
    expect(neighbors.sort((a, b) => a - b)).toEqual([0, 2, 3]);
  });
  it("shouldn't contain the original index", () => {
    const neighbors = gridNeighbors(2)(1);
    expect(neighbors.includes(1)).toBe(false);
  });
});

describe("bfs", () => {
  it("should return an optimal path", () => {
    const path = bfs(0, 2, gridNeighbors(3));
    expect(path).toEqual([0, 1, 2]);
  });
  it("should return just two elements if they are neighbors", () => {
    const path = bfs(0, 1, gridNeighbors(3));
    expect(path).toEqual([0, 1]);
  });
  it("should support diagonals", () => {
    const path = bfs(0, 3, gridNeighbors(2));
    expect(path).toEqual([0, 3]);
  });
  it("should find shortest path along straights", () => {
    const fromIndex = XYToIndex(
      {
        x: 0,
        y: 0
      },
      10
    );
    const toIndex = XYToIndex(
      {
        x: 0,
        y: 9
      },
      10
    );
    const path = bfs(fromIndex, toIndex, gridNeighbors(10));
    expect(path.length).toBe(10);
  });
});

describe("extendAndReconcile", () => {
  it("should extend an empty path", () => {
    const result = extendAndReconcilePath([], 1);
    expect(result).toEqual([1]);
  });
  it("should backtrack to a previous index if it is included twice", () => {
    const result = extendAndReconcilePath([0, 1, 2, 3], 2);
    expect(result).toEqual([0, 1, 2]);
  });
  it("should fill in any unwalkable gaps", () => {
    const result = extendAndReconcilePath([0, 1], 3);
    expect(result).toEqual([0, 1, 2, 3]);
  });
});
