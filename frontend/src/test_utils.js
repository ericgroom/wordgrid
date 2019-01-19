global.createMockSocket = function createMockSocket() {
  let handlers = {};
  let socket = {};
  socket.on = function(event, handler) {
    handlers[event] = handler;
  };
  socket.emit = function(event, ...args) {
    handlers[event](...args);
  };
  socket.handlers = handlers;
  return socket;
};
