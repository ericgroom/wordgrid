import gameReducer, * as gameSelectors from "../game";
import * as gameActions from "../../actions/game";

describe("gameReducer", () => {
  let initialState;
  beforeEach(() => {
    initialState = gameReducer(undefined, {});
  });
  it("initializes state correctly", () => {
    expect(initialState).toEqual({
      id: null,
      created: false,
      started: false,
      ended: false,
      countdown: false,
      countdownDuration: 0,
      duration: 0,
      joined: false,
      loading: false,
      exists: true,
      grid: null,
      wordsById: {},
      wordIds: [],
      nextWordId: 0,
      users: []
    });
  });
  it("adds a word properly", () => {
    const word = {
      id: initialState.nextWordId,
      word: "asdf",
      path: [0, 1, 2, 3]
    };
    const nextState = gameReducer(initialState, gameActions.addWord(word));
    expect(nextState.wordIds).toEqual([0]);
    expect(nextState.wordsById).toEqual({ 0: word });
  });
  it("updates a word properly", () => {
    const word = {
      id: initialState.nextWordId,
      word: "asdf",
      path: [0, 1, 2, 3]
    };
    const addedState = gameReducer(initialState, gameActions.addWord(word));
    const update = { id: word.id, valid: true, score: 40 };
    const updatedState = gameReducer(
      addedState,
      gameActions.updateWord(update)
    );
    const expectedWord = { ...word, ...update };
    expect(updatedState.wordIds).toEqual([0]);
    expect(updatedState.wordsById).toEqual({ 0: expectedWord });
  });
  it("can add and update multiple words", () => {
    const words = ["asdf", "fdsa", "fd"];
    let state = initialState;
    for (let word of words) {
      const id = state.nextWordId;
      state = gameReducer(state, gameActions.addWord({ word, id }));
    }
    expect(state.wordIds.length).toEqual(3);
    state = gameReducer(state, gameActions.updateWord({ id: 1, valid: true }));
    state = gameReducer(state, gameActions.updateWord({ id: 0, valid: false }));
    expect(state.wordsById[0]).toEqual({ id: 0, valid: false, word: "asdf" });
    expect(state.wordsById[1]).toEqual({ id: 1, valid: true, word: "fdsa" });
    expect(state.wordsById[2]).toEqual({ id: 2, word: "fd" });
  });
});
