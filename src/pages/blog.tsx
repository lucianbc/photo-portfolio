import React from "react";
import { graphql } from "gatsby";
import { Banner, BlogCards, Footer, Header } from "../components";

export const query = graphql`
  query BlogPage {
    allMarkdownRemark(sort: { fields: fields___slug, order: DESC }) {
      nodes {
        frontmatter {
          title
          date
          banner {
            childImageSharp {
              gatsbyImageData(
                width: 300
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
                aspectRatio: 1.5
              )
            }
          }
        }
        fields {
          slug
        }
      }
    }
  }
`;

type ScreenData = {
  allMarkdownRemark: {
    nodes: {
      frontmatter: {
        title: string;
        date: string;
        banner: {
          childImageSharp: {
            gatsbyImageData: any;
          };
        };
      };
      fields: {
        slug: string;
      };
    }[];
  };
};

const Blog: React.FC<{ data: ScreenData }> = ({ data }) => {
  return (
    <>
      <Header />
      <Banner title="Blog" />

      <div className="container-md">
        <BlogCards nodes={data.allMarkdownRemark.nodes} />
      </div>

      <Footer />
    </>
  );
};

export default Blog;
