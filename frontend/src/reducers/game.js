import _ from "lodash";
import {
  REQUEST_CREATE_GAME,
  GAME_CREATED,
  GAME_STATE_UPDATE,
  JOIN_GAME,
  LEAVE_GAME,
  UPDATE_WORD,
  WORD_COMPLETED,
  USER_JOIN,
  WORD_SENT,
  START_GAME,
  START_COUNTDOWN
} from "../actions";

const initialState = {
  id: null,
  created: false,
  started: false,
  countdown: false,
  countdownDuration: 0,
  joined: false,
  exists: true,
  grid: null,
  words: [],
  wordId: 0,
  sentWords: [], // words already sent to the backend so that saga can avoid duplicates
  users: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_CREATE_GAME:
      return { ...state, created: true };
    case GAME_CREATED:
      return { ...state, id: action.id };
    case GAME_STATE_UPDATE:
      return { ...state, ...action.state };
    case JOIN_GAME:
      return { ...state, id: action.id, joined: true };
    case LEAVE_GAME:
      return initialState;
    case UPDATE_WORD:
      const words = state.words;
      const wordIndex = _.findIndex(words, word => word.id === action.word.id);
      const word = words[wordIndex];
      const updatedWord = { ...word, ...action.word };
      let updatedWords = [...words];
      updatedWords[wordIndex] = updatedWord;
      return { ...state, words: updatedWords };
    case WORD_COMPLETED:
      // don't add word if the length is less than 3 or already added
      if (
        action.word.word.length < 3 ||
        state.words.some(({ word }) => word === action.word.word)
      ) {
        return state;
      }
      return {
        ...state,
        wordId: state.wordId + 1,
        words: [...state.words, { word: action.word.word, id: state.wordId }]
      };
    case WORD_SENT:
      return { ...state, sentWords: [...state.sentWords, action.word] };
    case USER_JOIN:
      return { ...state, users: [...state.users, action.nickname] };
    case START_GAME:
      return { ...state, started: true };
    case START_COUNTDOWN:
      return { ...state, countdown: true, countdownDuration: action.duration };
    default:
      return state;
  }
};
