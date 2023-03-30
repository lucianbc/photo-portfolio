const path = require("path");
const luxon = require("luxon");
const postTemplate = path.resolve(`./src/templates/Album.tsx`);

exports.createSchemaCustomization = ({ actions: { createTypes }, schema }) => {
  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter!
    }

    type MdxFrontmatter {
      banner: File @link(by: "name")
      images: [File] @link(by: "relativeDirectory", from: "collection")
    }
  `);
  const typeDef = [
    schema.buildObjectType({
      name: "MdxFrontmatter",
      fields: {
        date: {
          type: "Date",
          resolve: (source) =>
            luxon.DateTime.fromFormat(source.date, "dd-MM-yyyy", {
              zone: "UTC",
            }).toJSDate(),
          extensions: {
            dateformat: {},
          },
        },
      },
    }),
  ];
  createTypes(typeDef);
};

exports.onCreateNode = async ({ node, actions: { createNodeField } }) => {
  if (node.internal.type === 'Mdx') {
    const pathMarker = "content";
    const { contentFilePath } = node.internal;
    const p = path.parse(contentFilePath.slice(contentFilePath.indexOf(pathMarker) + pathMarker.length)).dir;

    createNodeField({
      node,
      name: 'slug',
      value: p,
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          internal {
            contentFilePath
          }
          fields {
            slug
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild("Error loading MDX result", result.errors);
  }
  // Create blog post pages.
  const posts = result.data.allMdx.nodes;
  // you'll call `createPage` for each result
  posts.forEach((node) => {
    createPage({
      // As mentioned above you could also query something else like frontmatter.title above and use a helper function
      // like slugify to create a slug
      path: node.fields.slug,
      // Provide the path to the MDX content file so webpack can pick it up and transform it into JSX
      // component: node.internal.contentFilePath,
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    });
  });
};
