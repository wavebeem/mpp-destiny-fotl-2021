const path = require("path");
const fs = require("fs");
const Image = require("@11ty/eleventy-img");

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
  const data = await Image(path.join(root, filename), {
    formats: ["jpeg"],
    outputDir: "_site/img/",
  });
  const name = filename.replace(/\.(jpg|jpeg|png)$/, "");
  const isWinner = name.includes("WINNER");
  return { ...data.jpeg[0], name, isWinner };
}

module.exports = getScreenshots;
