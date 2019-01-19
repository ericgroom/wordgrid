import React from "react";
import { shallow, mount } from "enzyme";
import WordGrid from "../WordGrid";

const letters = [
  "w",
  "o",
  "r",
  "d",
  "g",
  "r",
  "i",
  "d",
  "w",
  "o",
  "r",
  "d",
  "g",
  "r",
  "i",
  "d"
];

describe("<WordGrid />", () => {
  it("renders without crashing", () => {
    shallow(<WordGrid letters={[]} />);
  });
  it("calls onWord when a word is completed", () => {
    const onWord = jest.fn();
    const wrapper = mount(<WordGrid letters={letters} onWord={onWord} />);
    traverse(wrapper, [0]);
    expect(onWord.mock.calls.length).toBe(1);
    expect(onWord.mock.calls[0][0]).toEqual({ word: "w", path: [0] });
  });
  /* Having trouble simulating a continuous pointer event */
  it("allows for the selection of multiple letters", () => {
    const onWord = jest.fn();
    const wrapper = mount(<WordGrid letters={letters} onWord={onWord} />);
    traverse(wrapper, [0, 2, 3], true);
    expect(onWord.mock.calls.length).toBe(1);
    expect(onWord.mock.calls[0][0]).toEqual({
      word: "word",
      path: [0, 1, 2, 3]
    });
  });
});

/**
 * Testing util to traverse a path.
 *
 * Would like to use Pointer/Touch events in the future but they
 * aren't very well supported in enzyme or react-testing-library.
 * Both can get close, but require a hack and result in a brittle test.
 *
 * @param {object} wrapper enzyme wrapper
 * @param {number[]} indicies indicies of path to traverse
 * @param {boolean} debug print out nodes looped over
 */
function traverse(wrapper, indicies, debug = false) {
  if (!indicies || indicies.length === 0) return;
  wrapper.instance().beginPath(indicies[0]);
  indicies.forEach(i => {
    wrapper.instance().extendPath(i);
  });
  wrapper.instance().endPath();
}
