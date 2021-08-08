import React from "react";
import layout from "justified-layout";
import { graphql } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

export const query = graphql`
  query IndexPageQuery {
    allFile(sort: { fields: fields___exif___exif___DateTimeOriginal }) {
      nodes {
        childImageSharp {
          gatsbyImageData(
            width: 800
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
        absolutePath
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
      absolutePath: string;
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

const containerWidth = 1080;

const PhotoGrid = ({ photos }: { photos: QueryResult["allFile"]["nodes"] }) => {
  const ll = layout(
    photos.map((p) => p.fields.dimension.aspectRatio),
    {
      boxSpacing: 0,
      containerPadding: 0,
      containerWidth,
    }
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        // padding: "2.5px",
      }}
    >
      {React.Children.toArray(
        ll.boxes.map((b, i) => (
          <div
            style={{
              flex: `0 0 ${(b.width / containerWidth) * 100}%`,
              display: "inline-block",
              padding: "5px",
              boxSizing: "border-box",
            }}
          >
            <GatsbyImage
              image={getImage(photos[i] as any)}
              alt="hehe"
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        ))
      )}
    </div>
  );
};

const IndexPage = ({ data }: { data: QueryResult }) => {
  console.debug("data here", data);
  return <PhotoGrid photos={data.allFile.nodes} />;
};

export default IndexPage;
