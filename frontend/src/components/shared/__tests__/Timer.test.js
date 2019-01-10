import React from "react";
import { shallow } from "enzyme";
import Timer from "../Timer";

jest.useFakeTimers();

describe("<Timer />", () => {
  let spyComponent;
  beforeEach(() => {
    spyComponent = jest.fn(duration => <p>{duration}</p>);
  });
  it("renders without crashing", () => {
    shallow(<Timer>{spyComponent}</Timer>);
  });
  it("updates child component", () => {
    shallow(<Timer duration={60}>{spyComponent}</Timer>);
    // spyComponent has an initial call from when the component mounted
    expect(spyComponent.mock.calls[1][0]).toBe(60);
    jest.advanceTimersByTime(1000);
    expect(spyComponent.mock.calls[2][0]).toBe(59);
  });
  it("doesn't count into negative numbers", () => {
    shallow(<Timer duration={1}>{spyComponent}</Timer>);
    expect(spyComponent.mock.calls[1][0]).toBe(1);
    jest.advanceTimersByTime(10000);
    const last = spyComponent.mock.calls.length - 1;
    expect(spyComponent.mock.calls[last][0]).toBe(0);
  });
});
