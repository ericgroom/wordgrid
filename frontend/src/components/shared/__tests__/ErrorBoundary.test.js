import React from "react";
import { shallow } from "enzyme";
import ErrorBoundary from "../ErrorBoundary";

describe("<ErrorBoundary />", () => {
  let spyComponent;
  let boundary;
  beforeEach(() => {
    spyComponent = jest.fn(() => <div />);
    boundary = <ErrorBoundary>{spyComponent}</ErrorBoundary>;
  });
  it("renders without crashing", () => {
    shallow(boundary);
  });
  it("catches errors", () => {
    const wrapper = shallow(boundary);
    const catchMock = jest.fn();
    const error = new Error("test error");
    wrapper.instance().componentDidCatch = catchMock;
    wrapper.simulateError(error);
    expect(catchMock.mock.calls.length).toBe(1);
    expect(catchMock.mock.calls[0][0]).toBe(error);
  });
});
