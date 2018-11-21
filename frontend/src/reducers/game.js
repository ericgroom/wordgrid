import _ from "lodash";
import {
  CREATE_GAME,
  GAME_STATE_UPDATE,
  JOIN_GAME,
  LEAVE_GAME,
  UPDATE_WORD,
  WORD_COMPLETED,
  SET_NICKNAME,
  USER_JOIN,
  WORD_SENT,
  START_GAME
} from "../actions";

const initialState = {
  id: null,
  created: false,
  started: false,
  joined: false,
  exists: true,
  grid: null,
  words: [],
  wordId: 0,
  sentWords: [], // words already sent to the backend so that saga can avoid duplicates
  users: [],
  nickname: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAME:
      return { ...state, created: true };
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
      console.log(word, updatedWord);
      let updatedWords = [...words];
      updatedWords[wordIndex] = updatedWord;
      console.log(updatedWords);
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
    case SET_NICKNAME:
      return { ...state, nickname: action.nickname };
    case USER_JOIN:
      return { ...state, users: [...state.users, action.nickname] };
    case START_GAME:
      return { ...state, started: true };
    default:
      return state;
  }
};
