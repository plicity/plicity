module.exports = asyncFn => {
  return (...args) => {
    asyncFn(...args).catch(e => {
      console.error(e);
      process.exit(1);
    });
  };
};
