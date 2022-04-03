import React from "react";
import { graphql } from "gatsby";
import { PhotoGrid, SideNavLayout } from "../components";
import rehypeReact from "rehype-react";
import { ImageWithPreview } from "../components/PhotoPreviewPortal";
import "./blog.scss";
import { DateTime } from "luxon";

export const query = graphql`
  query BlogQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      htmlAst
      frontmatter {
        title
        date
        banner {
          childImageSharp {
            gatsbyImageData(
              width: 1800
              placeholder: DOMINANT_COLOR
              formats: [AUTO, WEBP, AVIF]
            )
          }
          name
        }
      }
      fields {
        photos {
          name {
            name
            id
            childImageSharp {
              gatsbyImageData(
                width: 1800
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
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
    }
  }
`;

type Data = {
  markdownRemark: {
    html: string;
    htmlAst: any;
    frontmatter: {
      title: string;
      date: string;
      banner: {
        childImageSharp: {
          gatsbyImageData: any;
        };
      } | null;
    };
    fields: {
      photos: {
        name: {
          name: string;
          id: string;
          childImageSharp: {
            gatsbyImageData: any;
          };
          fields: {
            dimension: {
              height: number;
              width: number;
              aspectRatio: number;
            };
          };
        };
      }[];
    };
  };
};

const PhotoGridAdapter = (pageData: Data) => (props: any) => {
  const photoNames = props.children.flatMap((child) => {
    if (
      typeof child === "object" &&
      child?.props?.children &&
      child?.props?.children[0] &&
      typeof child?.props?.children[0] === "string"
    ) {
      return child.props.children[0];
    }
    return [];
  });

  const photos = photoNames.flatMap((name) => {
    const photoItem = findPhoto(name, pageData);
    if (photoItem) return [photoItem.name];
    return [];
  });

  return (
    <div>
      <PhotoGrid photos={photos} />
    </div>
  );
};

const findPhoto = (name: string, pageData: Data) => {
  return pageData.markdownRemark.fields.photos.find(
    (p) => p.name.name === name
  );
};

const PhotoAdapter = (pageData: Data) => (props: any) => {
  const photoName = props.children[0];
  const photoObject = findPhoto(photoName, pageData);

  if (!photoObject) {
    return null;
  }

  const allPhotos = pageData.markdownRemark?.fields?.photos;

  return (
    <div className="single-image container-sm">
      <ImageWithPreview
        photo={photoObject.name}
        photoCollection={allPhotos?.map((x) => x.name)}
      />
    </div>
  );
};

const useRenderAst = (pageData: Data) => {
  const renderAST = new rehypeReact({
    createElement: React.createElement,
    components: {
      p: () => null,
      h1: () => null,
      h2: () => null,
      h3: () => null,
      h4: () => null,
      h5: () => null,
      h6: () => null,
      ["photo-grid" as any]: PhotoGridAdapter(pageData),
      ["photo" as any]: PhotoAdapter(pageData),
    },
  }).Compiler;
  return renderAST;
};

type ScreenProps = {
  data: Data;
};

const formatDate = (dateStr: string) => {
  const date = DateTime.fromFormat(dateStr, "dd-MM-yyyy");
  return date.toFormat("MMMM d, yyyy");
};

const BlogPage = ({ data }: ScreenProps) => {
  const renderAST = useRenderAst(data);
  return (
    <SideNavLayout
      title={data.markdownRemark.frontmatter.title}
      subtitle={
        data.markdownRemark.frontmatter.date
          ? `Posted on ${formatDate(data.markdownRemark.frontmatter.date)}`
          : undefined
      }
    >
      {renderAST(data.markdownRemark.htmlAst)}
    </SideNavLayout>
  );
};

export default BlogPage;
