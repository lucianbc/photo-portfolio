import React from "react";
import { graphql } from "gatsby";
import { PhotoGrid } from "../components/ResponsivePhotoGrid";
import { SideNavLayout } from "../components";

export const query = graphql`
  query {
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

export default ({ data }) => {
  return (
    <SideNavLayout>
      <PhotoGrid photos={data.feed.images} />
    </SideNavLayout>
  );
};
