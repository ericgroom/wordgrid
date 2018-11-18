import io from "socket.io-client";

const socketMiddleware = url => store => {
  const socket = io.connect(url);
  socket.on("chat message", message => {
    console.log(`recieved message`);
    store.dispatch({
      type: "RECIEVED_MESSAGE",
      message
    });
  });
  return next => action => {
    if (action.type === "SEND_MESSAGE") {
      console.log(`sending message`);
      socket.emit("chat message", action.message);
      return;
    }

    return next(action);
  };
};

export default socketMiddleware;
