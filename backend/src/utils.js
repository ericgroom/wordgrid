const HashIds = require("hashids");
const hashIds = new HashIds("WordGrid", 6);

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

function encodeId(id) {
  return hashIds.encode(id);
}

function decodeId(id) {
  return hashIds.decode(id)[0];
}

module.exports = {
  timedLoop,
  encodeId,
  decodeId
};
