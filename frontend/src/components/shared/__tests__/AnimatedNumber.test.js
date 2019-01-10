import React from "react";
import { shallow, render as r } from "enzyme";
import AnimatedNumber from "../AnimatedNumber";

jest.useFakeTimers();

describe("<AnimatedNumber />", () => {
  it("renders without crashing", () => {
    shallow(<AnimatedNumber num={0} />);
  });
});
