import React from "react";
import { shallow, mount } from "enzyme";
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
  it("can send a message", () => {
    const onSend = jest.fn();
    const wrapper = mount(<ChatWindow sendMessage={onSend} />);
    wrapper
      .find("form")
      .first()
      .simulate("submit");
    expect(onSend.mock.calls.length).toBe(1);
  });
});
