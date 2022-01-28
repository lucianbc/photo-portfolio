import React from "react";
import { graphql } from "gatsby";
import "./blog.scss";
import { Header } from "../components";

export const query = graphql`
  query BlogQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
      }
    }
  }
`;

const BlogPage = ({ data }) => {
  return (
    <>
      <Header />
      <div className="container-sm">
        <h1>{data.markdownRemark.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      </div>
    </>
  );
};

export default BlogPage;
