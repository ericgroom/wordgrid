import React from "react";
import { shallow } from "enzyme";
import TouchListener from "../TouchListener";

describe("<TouchListener />", () => {
  let mockFunc;
  let component;
  beforeEach(() => {
    mockFunc = jest.fn();
    component = <TouchListener onTouchEnd={mockFunc} />;
  });
  it("renders without crashing", () => {
    shallow(component);
  });
  it("calls onTouchEnd appropriately", async () => {
    const wrapper = shallow(component);
    wrapper.simulate("touchstart", new Event("touchstart"));
    wrapper.simulate("touchend", new Event("touchend"));
    expect(mockFunc.mock.calls.length).toBe(1);
  });
});
