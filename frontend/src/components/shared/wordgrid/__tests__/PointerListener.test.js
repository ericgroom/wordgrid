import React from "react";
import { shallow } from "enzyme";
import PointerListener from "../PointerListener";

describe("<PointerListener />", () => {
  let component;
  let mockFunc;
  beforeEach(() => {
    mockFunc = jest.fn();
    component = (
      <PointerListener onPointerUp={mockFunc}>
        <div />
      </PointerListener>
    );
  });
  it("renders without crashing", () => {
    shallow(component);
  });
  /** enzyme simulate can't trigger document events */
  it.skip("calls onPointerUp when pointerup event is registered", async () => {
    const wrapper = shallow(component);
    wrapper.simulate("pointerup", new Event("pointerup"));
    expect(mockFunc.mock.calls.length).toBe(1);
  });
});
