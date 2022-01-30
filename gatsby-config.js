module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "photo-portfolio",
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-component-parent2div`,
          {
            resolve: `gatsby-remark-classes`,
            options: {
              classMap: {
                "heading[depth=1]": "container-sm",
                "heading[depth=2]": "container-sm",
                paragraph: "container-sm",
              },
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `photos`,
        path: `${__dirname}/src/images/portfolio/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "posts",
        path: `${__dirname}/src/posts/`,
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sass`,
  ],
};
