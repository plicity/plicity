module.exports = async timeoutMs => {
  await new Promise(resolve => {
    setTimeout(resolve, timeoutMs);
  });
};