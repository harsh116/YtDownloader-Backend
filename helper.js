const promiseSetTimeOut = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const getExpiryTimeInHours = (hours) => {
  const d = new Date();
  const one_hour = 3600 * 1000;

  d.setTime(Date.now() + hours * one_hour);

  return d.getTime();
};

const toNumber = (str) => {
  const regex = /[0-9]+/;
  return Number(regex.exec(str));
};

module.exports = {
  promiseSetTimeOut,
  getExpiryTimeInHours,
  toNumber,
};
