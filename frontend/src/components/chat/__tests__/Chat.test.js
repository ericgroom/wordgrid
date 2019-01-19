import React from "react";
import { shallow } from "enzyme";
import { Chat } from "../Chat";

describe("<Chat />", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<Chat sendMessage={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
