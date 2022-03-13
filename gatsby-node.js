const ExifImage = require("exif").ExifImage;
const util = require("util");
const sizeOf = require("image-size");
const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);
const { extractAllPhotoNamesRegex } = require("./utils/extractImages");

async function onCreateNode(params) {
  const { node } = params;
  if (node.internal.mediaType === "image/jpeg") {
    enhanceImageNode(params);
  }
  if (node.internal.type === "MarkdownRemark") {
    enhanceMarkdownPost(params);
  }
  if (node.sourceInstanceName === "configs") {
    createConfigs(params);
  }
}

async function createPages({ graphql, actions }) {
  const { createPage } = actions;
  await createBlogPages(createPage, graphql);
}

async function createConfigs(params) {
  const { node, createNodeId, createContentDigest, actions } = params;
  const { createNode } = actions;
  if (node.name === "feed") {
    const feedObject = JSON.parse(node.internal.content);
    const nodeMeta = {
      id: createNodeId(`feed-${node.id}`),
      parent: node.id,
      internal: {
        type: "Feed",
        contentDigest: createContentDigest(feedObject),
      },
    };
    const feedNode = Object.assign({}, feedObject, nodeMeta);
    createNode(feedNode);
  } else if (node.name === "index") {
    const feedObject = JSON.parse(node.internal.content);
    const nodeMeta = {
      id: createNodeId(`index-${node.id}`),
      parent: node.id,
      internal: {
        type: "Index",
        contentDigest: createContentDigest(feedObject),
      },
    };
    const feedNode = Object.assign({}, feedObject, nodeMeta);
    createNode(feedNode);
  }
}

async function enhanceMarkdownPost(params) {
  const {
    node,
    getNode,
    actions: { createNodeField },
  } = params;
  const slug = createFilePath({ node, getNode, basePath: `pages` });
  const rawMarkdown = node.internal.content;
  const photos = extractAllPhotoNamesRegex(rawMarkdown);

  createNodeField({
    node,
    name: `slug`,
    value: slug,
  });

  createNodeField({
    node,
    name: `photos`,
    value: photos.map((name) => ({
      name,
    })),
  });
}

const createSchemaCustomization = (params) => {
  const {
    actions: { createTypes },
  } = params;

  const typeDefs = `
    type MarkdownRemarkFieldsPhotos implements Node {
      name: File @link(by: "name")
    }
    type MarkdownRemarkFrontmatter implements Node {
      banner: File @link(by: "name")
    }
  `;

  const feedDefs = `
    type Feed implements Node {
      images(limit: Int, skip: Int): [File]! @link(by: "name")
    }
  `;

  const indexDefs = `
    type Index implements Node {
      feedPreview(limit: Int, skip: Int): [File]! @link(by: "name")
    }
  `;

  createTypes(typeDefs);
  createTypes(feedDefs);
  createTypes(indexDefs);
};

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

async function createBlogPages(createPage, graphql) {
  const query = `
    query BlogPosts {
      allMarkdownRemark {
        nodes {
          htmlAst
          timeToRead
          fields {
            slug
          }
        }
      }
    }
  `;

  const result = await graphql(query);

  const blogPostData = result.data.allMarkdownRemark.nodes;

  blogPostData.forEach((node) => {
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
exports.createSchemaCustomization = createSchemaCustomization;
