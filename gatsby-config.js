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
        plugins: [`gatsby-remark-component-parent2div`],
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
