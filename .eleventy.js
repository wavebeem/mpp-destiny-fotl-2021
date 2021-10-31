module.exports = (config) => {
  config.addFilter("json", (value) => JSON.stringify(value, null, 2));
  config.addPassthroughCopy("src/static");
  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
