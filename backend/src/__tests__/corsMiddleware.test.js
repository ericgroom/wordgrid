const corsMiddleware = require("../corsMiddleware");

describe("corsMiddleware", () => {
  it("uses `*` when no url is passed", () => {
    const spy = jest.fn();
    const next = jest.fn();
    const middleware = corsMiddleware();
    middleware(null, { header: spy }, next);
    expect(next.mock.calls.length).toBe(1);
    expect(spy.mock.calls.length).toBe(2);
    expect(spy.mock.calls[0][1]).toBe("*");
  });
  it("uses passed url when present", () => {
    const url = "http://asdf.com/";
    const spy = jest.fn();
    const next = jest.fn();
    const middleware = corsMiddleware(url);
    middleware(null, { header: spy }, next);
    expect(next.mock.calls.length).toBe(1);
    expect(spy.mock.calls.length).toBe(2);
    expect(spy.mock.calls[0][1]).toBe(url);
  });
});
