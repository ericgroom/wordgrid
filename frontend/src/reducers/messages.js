import { LEAVE_GAME } from "../actions";
export const RECEIVED_MESSAGE = "RECIEVED_MESSAGE";
export const SEND_MESSAGE = "SEND_MESSAGE";

const initialState = {
  messages: [],
  messageId: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          { ...action.message, id: state.messageId }
        ],
        messageId: state.messageId + 1
      };
    case LEAVE_GAME:
      return initialState;
    default:
      return state;
  }
};
