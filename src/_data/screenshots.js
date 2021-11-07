const path = require("path");
const fs = require("fs");
const loadImage = require("@11ty/eleventy-img");

const folders = fs.readdirSync(path.join(__dirname, "../../img"));

async function getScreenshots() {
  const entries = await Promise.all(
    folders.map(async (folder) => {
      return [folder, await getOneFolder(folder)];
    })
  );
  return Object.fromEntries(entries);
}

async function getOneFolder(folder) {
  const root = path.resolve(__dirname, "../../img", folder);
  return await Promise.all(
    fs
      .readdirSync(root)
      .filter((filename) => {
        return (
          filename.endsWith(".png") ||
          filename.endsWith(".jpg") ||
          filename.endsWith(".jpeg")
        );
      })
      .map(async (filename) => {
        return await readInfo({ root, filename });
      })
  );
}

async function readInfo({ root, filename }) {
  const data = await loadImage(path.join(root, filename), {
    formats: ["jpeg"],
    outputDir: "_site/img/",
  });
  const name = filename.replace(/\.(jpg|jpeg|png)$/, "");
  const classNames = Object.entries({
    "BEST IN SHOW": "b--green",
    "BEST HUNTER": "b--blue",
    "BEST TITAN": "b--red",
    "BEST WARLOCK": "b--yellow",
    WINNER: "b--white",
    "": "b--dark-gray",
  }).flatMap(([k, v]) => (name.includes(k) ? [v] : []))[0];
  return { ...data.jpeg[0], name, classNames };
}

module.exports = getScreenshots;
