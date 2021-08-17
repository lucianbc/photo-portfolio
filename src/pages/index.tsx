import React from "react";
import { graphql } from "gatsby";
import { PhotoGrid } from "../components";
import "@fontsource/montserrat";

export const query = graphql`
  query IndexPageQuery {
    allFile(
      sort: { fields: fields___exif___exif___DateTimeOriginal, order: [DESC] }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData(
            width: 800
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
        name
        id
        fields {
          dimension {
            height
            width
            aspectRatio
          }
        }
      }
    }
  }
`;

type QueryResult = {
  allFile: {
    nodes: {
      name: string;
      id: string;
      childImageSharp: any;
      fields: {
        dimension: {
          height: number;
          width: number;
          aspectRatio: number;
        };
      };
    }[];
  };
};

const Header = () => {
  return (
    <header
      style={{
        width: "95%",
        margin: "20px auto",
        display: "flex",
        fontFamily: "Montserrat",
        cursor: "default",
        paddingLeft: "5px",
      }}
    >
      <h1>Lucian Boaca | Photo</h1>
    </header>
  );
};

const IndexPage = ({ data }: { data: QueryResult }) => {
  return (
    <>
      <Header />
      <PhotoGrid photos={data.allFile.nodes} />
    </>
  );
};

export default IndexPage;
