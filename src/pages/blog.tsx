import React from "react";
import { graphql } from "gatsby";
import { BlogCards, Footer, Header } from "../components";

export const query = graphql`
  query BlogPage {
    allMarkdownRemark {
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

const Banner = () => {
  return (
    <div className="container-lg banner-page">
      <h1>Blog</h1>
    </div>
  );
};

const Blog: React.FC<{ data: ScreenData }> = ({ data }) => {
  return (
    <>
      <Header />
      <Banner />

      <div className="container-md">
        <BlogCards nodes={data.allMarkdownRemark.nodes} />
      </div>

      <Footer />
    </>
  );
};

export default Blog;
