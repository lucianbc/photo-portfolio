import React from "react";
import { graphql } from "gatsby";
import { SideNavLayout, AlbumCard } from "../components";
import styled from "styled-components";

export const query = graphql`
  query AlbumsPage {
    allMarkdownRemark(sort: { fields: fields___slug, order: DESC }) {
      nodes {
        frontmatter {
          title
          date
          banner {
            childImageSharp {
              gatsbyImageData(
                width: 500
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

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -10px;

  & > * {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

const AlbumsPage = ({ data }) => {
  return (
    <SideNavLayout title="Albums">
      <Wrapper>
        {React.Children.toArray(
          data.allMarkdownRemark.nodes.map((node) => (
            <AlbumCard
              banner={node.frontmatter.banner}
              title={node.frontmatter.title}
              slug={node.fields.slug}
            />
          ))
        )}
      </Wrapper>
    </SideNavLayout>
  );
};

export default AlbumsPage;
