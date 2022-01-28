const ExifImage = require("exif").ExifImage;
const util = require("util");
const sizeOf = require("image-size");
const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

async function onCreateNode(params) {
  const { node } = params;
  if (node.internal.mediaType === "image/jpeg") {
    enhanceImageNode(params);
  }
  if (node.internal.type === "MarkdownRemark") {
    enhanceMarkdownPost(params);
  }
}

async function createPages({ graphql, actions }) {
  const { createPage } = actions;
  await createPhotoPages(createPage, graphql);
  await createBlogPages(createPage, graphql);
}

async function enhanceMarkdownPost({
  node,
  getNode,
  actions: { createNodeField },
}) {
  const slug = createFilePath({ node, getNode, basePath: `pages` });

  createNodeField({
    node,
    name: `slug`,
    value: slug,
  });
}

async function enhanceImageNode({ node, actions: { createNodeField } }) {
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

async function createPhotoPages(createPage, graphql) {
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

async function createBlogPages(createPage, graphql) {
  const query = `
    query BlogPosts {
      allMarkdownRemark {
        nodes {
          timeToRead
          fields {
            slug
          }
        }
      }
    }
  `;

  const result = await graphql(query);

  result.data.allMarkdownRemark.nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve("./src/templates/blog.tsx"),
      context: {
        slug: node.fields.slug,
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
