const path = require("path");
const fs = require("fs");
const getImageColors = require("get-image-colors");
const getImageSize = require("image-size");
const { AssetCache } = require("@11ty/eleventy-cache-assets");

const basePath = "/static/img/crucible/";
const root = path.resolve(__dirname, `../${basePath}`);

async function getScreenshots() {
  return await Promise.all(fs.readdirSync(root).map(readInfo));
}

async function readInfo(filename) {
  const url = basePath + filename;
  const name = path
    .basename(path.basename(filename, ".png"), ".jpg")
    .replace(/[_-]/g, " ");
  const file = path.join(root, filename);
  const { width, height } = getImageSize(file);
  const colors = await getImageColors(file);
  const color = colors[0].hex();
  const obj = { url, name, width, height, color };
  return obj;
}

// Delete `.cache` dir when adding new image files locally
async function getScreenshotsCached() {
  const asset = new AssetCache("mpp-destiny-fotl-2021");
  if (asset.isCacheValid("1d")) {
    return await asset.getCachedValue();
  }
  const art = await getScreenshots();
  await asset.save(art, "json");
  return art;
}

module.exports = getScreenshotsCached;
