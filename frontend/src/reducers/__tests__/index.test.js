import { createStore } from "redux";
import rootReducer from "../index";
import messagesReducer from "../messages";
import userReducer from "../user";
import gameReducer from "../game";

describe("rootReducer", () => {
  it("initializes child reducers", () => {
    const store = createStore(rootReducer);
    expect(store.getState().messages).toEqual(messagesReducer(undefined, {}));
    expect(store.getState().user).toEqual(userReducer(undefined, {}));
    expect(store.getState().game).toEqual(gameReducer(undefined, {}));
  });
});
