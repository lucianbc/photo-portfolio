const ExifImage = require("exif").ExifImage;
const util = require("util");
const sizeOf = require("image-size");
const path = require("path");

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

async function createPages({ graphql, actions }) {
  const { createPage } = actions;
  const photoPageTemplate = path.resolve(`src/templates/photo.tsx`);
  const photosQuery = `
    query loadPhotosForPages {
      allFile(filter: {
        sourceInstanceName:{
          eq: "photos"
        }
      }) {
        nodes {
          id
        }
      }
    }  
  `;
  const photos = await graphql(photosQuery).then((result) => {
    if (result.errors) {
      throw result.errors;
    }
    return result.data.allFile.nodes;
  });
  photos.forEach((node) => {
    createPage({
      path: `/photos/${node.id}`,
      component: photoPageTemplate,
      context: {
        photoId: node.id,
      },
    });
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
exports.createPages = createPages;
