import React from "react";
import { shallow } from "enzyme";
import Error from "../Error";

describe("<Error />", () => {
  it("renders without crashing", () => {
    shallow(<Error dismiss={() => {}} />);
  });
  it("shows when an error is passed", () => {
    const wrapper = shallow(<Error error="asdf" dismiss={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("calls dismiss when x is clicked", () => {
    const dismissMock = jest.fn();
    const wrapper = shallow(<Error error="???" dismiss={dismissMock} />);
    const closeButton = wrapper.find(".close").first();
    closeButton.simulate("click");
    expect(dismissMock.mock.calls.length).toBe(1);
  });
});
