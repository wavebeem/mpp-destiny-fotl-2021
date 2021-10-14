const path = require("path");
const fs = require("fs");
const getImageSize = require("image-size");
const { AssetCache } = require("@11ty/eleventy-cache-assets");

const folders = ["crucible", "gambit", "vanguard", "cute", "scary"];

async function getScreenshots() {
  return Object.fromEntries(
    folders.map((folder) => {
      return [folder, getOneFolder(folder)];
    })
  );
}

function getOneFolder(folder) {
  const root = path.resolve(__dirname, "../static/img", folder);
  return fs
    .readdirSync(root)
    .map((filename) => readInfo({ folder, root, filename }));
}

function readInfo({ folder, root, filename }) {
  const url = `/static/img/${folder}/${filename}`;
  const name = path
    .basename(path.basename(filename, ".png"), ".jpg")
    .replace(/[_-]/g, " ");
  const { width, height } = getImageSize(path.join(root, filename));
  return { url, name, width, height };
}

// Delete `.cache` dir when adding new image files locally
async function getScreenshotsCached() {
  const asset = new AssetCache("mpp-destiny-fotl-2021");
  if (asset.isCacheValid("1d")) {
    return await asset.getCachedValue();
  }
  const data = getScreenshots();
  await asset.save(data, "json");
  return data;
}

module.exports = getScreenshots;
