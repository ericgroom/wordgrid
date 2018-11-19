export const EXTEND_PATH = "EXTEND_PATH";
export const END_PATH = "END_PATH";
export const BEGIN_PATH = "BEGIN_PATH";

export const extendPath = index => ({
  type: EXTEND_PATH,
  index
});

export const endPath = () => ({
  type: END_PATH
});

export const beginPath = index => ({
  type: BEGIN_PATH,
  index
});
