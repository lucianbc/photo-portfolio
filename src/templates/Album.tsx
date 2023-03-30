import React from "react";
import { graphql } from "gatsby";
import { Link } from "gatsby";
import { PhotoGrid } from "../components/ResponsivePhotoGrid";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { DateTime } from "luxon";
import { Footer } from "../components/Footer";
import { PhotoPreviewPortal } from "../components/PhotoPreviewPortal";
const shortcodes = { Link }; // Provide common components here

export default function AlbumTemplate({ data }) {
  return (
    <PhotoPreviewPortal>
      <Link
        to="/"
        className="fixed z-10 bg-black text-white py-2 px-4 bg-opacity-50 rounded-full mt-5 ml-5 cursor-pointer"
      >
        HOME
      </Link>
      <div className="h-screen mb-4">
        <GatsbyImage
          objectFit="cover"
          image={getImage(data.mdx.frontmatter.banner) as any}
          alt=""
          style={{ height: "100%", width: "100%" }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col items-center justify-center">
          <h1 className="text-6xl relative bottom-4">
            {data.mdx.frontmatter.title}
          </h1>
          <span className="text-sm uppercase absolute bottom-0 mb-6">
            Posted on{" "}
            {DateTime.fromISO(data.mdx.frontmatter.date).toLocaleString(
              DateTime.DATE_FULL
            )}
          </span>
        </div>
      </div>
      <main className="container">
        <PhotoGrid photos={sortedByDateTaken(data.mdx.frontmatter.images)} />
      </main>
      <Footer />
    </PhotoPreviewPortal>
  );
}

const sortedByDateTaken = (data: any[]) => {
  return data.sort((a, b) => Date.parse(a.childImageSharp.fields.exif.meta.dateTaken) - Date.parse(b.childImageSharp.fields.exif.meta.dateTaken));
} 

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date
        images {
          id
          childImageSharp {
            original {
              height
              width
            }
            gatsbyImageData(formats: [AUTO, WEBP], width: 1000, quality: 90)
            fields {
              exif {
                meta {
                  dateTaken
                }
              }
            }
          }
          name
        }
        banner {
          childImageSharp {
            gatsbyImageData(formats: AUTO)
          }
        }
      }
    }
  }
`;
