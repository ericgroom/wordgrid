const utils = require("../utils");

describe("timedLoop", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it("ends when callback is false", async () => {
    const next = jest.fn().mockReturnValue(1);
    const callback = jest.fn().mockReturnValue(false);
    const predicate = jest.fn().mockReturnValue(true);
    await utils.timedLoop(next, callback, predicate, 200);
    expect(next.mock.calls.length).toBe(1);
    expect(callback.mock.calls.length).toBe(1);
    expect(predicate.mock.calls.length).toBe(1);
  });
  //   it("calls callback when predicate is true", async () => {
  //     const next = jest
  //       .fn()
  //       .mockReturnValueOnce(1)
  //       .mockReturnValueOnce(1)
  //       .mockReturnValueOnce(2);
  //     const callback = jest
  //       .fn()
  //       .mockReturnValueOnce(true)
  //       .mockReturnValueOnce(false);
  //     const predicate = jest
  //       .fn()
  //       .mockImplementation((prev, next) => prev !== next);
  //     await utils.timedLoop(next, callback, predicate, 200);
  //     expect(predicate.mock.calls.length).toBe(3);
  //     expect(callback.mock.calls.length).toBe(2);
  //     expect(next.mock.calls.length.toBe(3));
  //   });
});
