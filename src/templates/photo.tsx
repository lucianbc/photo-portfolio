import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import { getImage } from "gatsby-plugin-image";
import "../styles/fullHeightPage.css";
import styled from "styled-components";
import { Footer } from "../components";

export const query = graphql`
  query loadPhoto($photoId: String!) {
    file(id: { eq: $photoId }) {
      id
      childImageSharp {
        gatsbyImageData(
          width: 1300
          placeholder: NONE
          formats: [AUTO, WEBP, AVIF]
        )
      }
    }
  }
`;

const PhotoPage = ({ data }) => {
  return (
    <>
      <nav
        style={{
          position: "absolute",
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
          zIndex: 99,
        }}
      >
        <PlainLink to="/">
          <XSpan>&#x2A09;</XSpan>
        </PlainLink>
      </nav>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          boxSizing: "border-box",
          padding: "20px",
        }}
      >
        <GatsbyImage
          image={getImage(data.file)}
          alt="hehe"
          style={{ width: "100%", height: "100%" }}
          imgStyle={{ objectFit: "contain" }}
        />
      </div>
      <Footer />
    </>
  );
};

const XSpan = styled.span`
  padding: 20px;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;
  margin-right: 20px;
  font-size: 1.5rem;
`;

const PlainLink = styled(Link)`
  :link,
  :visited,
  :hover,
  :active {
    color: black;
  }
`;

export default PhotoPage;
