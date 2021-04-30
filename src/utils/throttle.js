const throttle = (callback, ms) => {
  let lock;
  return function () {
    if (!lock) {
      lock = setTimeout(() => {
        callback(...arguments);
        lock = false;
      }, ms);
    }
  };
};

export default throttle;
