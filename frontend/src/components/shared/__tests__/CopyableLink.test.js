import React from "react";
import { shallow, mount } from "enzyme";
import CopyableLink from "../CopyableLink";

describe("<CopyableLink />", () => {
  const exec = global.document.execCommand;
  let mock;
  beforeEach(() => {
    mock = jest.fn();
    global.document.execCommand = mock;
  });
  afterAll(() => {
    global.document.execCommand = exec;
  });
  it("renders without crashing", () => {
    shallow(<CopyableLink url="https://test.test" />);
  });
  it("copys link when user clicks button", () => {
    const wrapper = mount(<CopyableLink url="https://test.test" />);
    const button = wrapper.find(`button`);
    button.simulate("click");
    expect(mock.mock.calls.length).toBe(1);
  });
});
