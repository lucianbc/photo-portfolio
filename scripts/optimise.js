const sharp = require(`sharp`);
const glob = require(`glob`);
const fs = require(`fs-extra`);
const path = require("path");

const matches = glob.sync(`src/content/images-raw/**/*.{png,jpg,jpeg}`);
const MAX_WIDTH = 1800;
const QUALITY = 70;

Promise.all(matches).then((m) => console.debug(m));

Promise.all(
  matches.map(async (match) => {
    const stream = sharp(match);
    const info = await stream.metadata();

    const resized = info.width < MAX_WIDTH ? stream : stream.resize(MAX_WIDTH);

    const optimizedFilePath = match.replace("images-raw", "images");
    const dirPath = path.parse(optimizedFilePath).dir;
    await fs.mkdirs(dirPath);

    return resized
      .withMetadata()
      .jpeg({ quality: QUALITY })
      .toFile(optimizedFilePath);
  })
);
