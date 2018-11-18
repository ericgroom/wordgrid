export const RECEIVED_MESSAGE = "RECIEVED_MESSAGE";
export const SEND_MESSAGE = "SEND_MESSAGE";

const initialState = {
  messages: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] };
    case SEND_MESSAGE:
      console.log(`sending: ${action.message}`);
      return state;
    default:
      return state;
  }
};
