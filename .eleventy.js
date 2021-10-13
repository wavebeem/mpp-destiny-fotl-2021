module.exports = (config) => {
  config.addPassthroughCopy("src/_redirects");
  config.addPassthroughCopy("src/static");
  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
