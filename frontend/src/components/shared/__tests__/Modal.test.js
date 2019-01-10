import React from "react";
import { shallow, mount } from "enzyme";
import Modal from "../Modal";

describe("<Modal />", () => {
  it("renders without crashing", () => {
    shallow(<Modal show={false} />);
  });
  it("shows when `props.show` is true", () => {
    const wrapper = shallow(<Modal show={true} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("doesn't show when `props.show` is false", () => {
    const wrapper = shallow(<Modal show={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
