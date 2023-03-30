import { graphql } from "gatsby";

export const albumQueryFragment = graphql`
  fragment AlbumQueryFragment on File {
    childMdx {
      frontmatter {
        title
        banner {
          childImageSharp {
            gatsbyImageData(
              aspectRatio: 1
              formats: [AUTO, WEBP, AVIF]
              width: 640
              quality: 90
            )
          }
        }
      }
    }
  }
`;
