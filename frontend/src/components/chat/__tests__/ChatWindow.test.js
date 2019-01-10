import React from "react";
import { shallow } from "enzyme";
import ChatWindow from "../ChatWindow";

describe("<ChatWindow />", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<ChatWindow sendMessage={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a list of messages if they exist", () => {
    const messages = ["hi", "I'm", "super", "creative"].map((m, i) => ({
      sender: "eric",
      id: i,
      message: m
    }));
    const wrapper = shallow(
      <ChatWindow sendMessage={() => {}} messages={messages} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
