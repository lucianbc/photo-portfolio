import { graphql } from "gatsby";
import React from "react";
import { Banner, Footer, Header, PhotoGrid } from "../components";
import { PhotoPreviewPortal } from "../components/PhotoPreviewPortal";

export const query = graphql`
  query FeedPageQuery {
    feed {
      images {
        childImageSharp {
          gatsbyImageData(
            width: 1800
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

const Feed = ({ data }) => {
  return (
    <PhotoPreviewPortal>
      <Header />
      <Banner title="Feed" />
      <div className="container-lg">
        <PhotoGrid photos={data.feed.images} />
      </div>
      <Footer />
    </PhotoPreviewPortal>
  );
};

export default Feed;
