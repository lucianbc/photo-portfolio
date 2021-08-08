const ExifImage = require("exif").ExifImage;
const util = require("util");
const sizeOf = require("image-size");

async function onCreateNode({ node, actions: { createNodeField } }) {
  if (node.internal.mediaType !== "image/jpeg") return;

  const x = await readExif(node.absolutePath);
  const size = await util.promisify(sizeOf)(node.absolutePath);

  createNodeField({
    name: "exif",
    value: x,
    node,
  });
  createNodeField({
    name: "dimension",
    value: {
      ...size,
      aspectRatio: size.width / size.height,
    },
    node,
  });
}

const readExif = (path) =>
  new Promise((resolve, reject) => {
    new ExifImage({ image: path }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

exports.onCreateNode = onCreateNode;
