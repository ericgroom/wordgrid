import _ from "lodash";
import { BEGIN_PATH, EXTEND_PATH, END_PATH } from "../actions";
import { appendOrRevert, bfs, gridNeighbors } from "../utils";

const initialState = {
  path: null,
  gridSize: 4,
  score: 0,
  letters: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "c",
    "o",
    "o",
    "l"
  ]
};

function extendPath(path, index, gridSize) {
  // only allows including an index once
  let simplifiedPath = appendOrRevert(path, index);
  // make sure the path is walkable and fill in any gaps
  if (simplifiedPath.length > 1) {
    const current = simplifiedPath[simplifiedPath.length - 1];
    const previous = simplifiedPath[simplifiedPath.length - 2];
    const expandedPath = bfs(previous, current, gridNeighbors(gridSize));
    simplifiedPath = [...simplifiedPath.slice(0, -2), ...expandedPath];
  }
  return simplifiedPath;
}

export default (state = initialState, action) => {
  switch (action.type) {
    case BEGIN_PATH:
      return { ...state, path: [action.index] };
    case EXTEND_PATH:
      return {
        ...state,
        path: extendPath(state.path, action.index, state.gridSize)
      };
    case END_PATH:
      return {
        ...state,
        path: null,
        score: state.score + _.get(state, "path.length", 0)
      };
    default:
      return state;
  }
};
