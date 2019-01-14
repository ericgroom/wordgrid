async function timedLoop(next, callback, callbackPredicate, delay) {
  var loop = async function(prevState = null) {
    try {
      const newState = await next();

      let result;
      if (callbackPredicate(prevState, newState)) {
        result = callback(null, newState);
      }
      if (result !== false) {
        setTimeout(loop.bind(this, newState), delay);
      }
    } catch (e) {
      console.error(e);
      callback(e, null);
    }
  };
  await loop();
}

module.exports = {
  timedLoop
};
