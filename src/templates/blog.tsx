import React from "react";
import { graphql } from "gatsby";
import { Header, PhotoGrid } from "../components";
import rehypeReact from "rehype-react";
import "./blog.scss";
import {
  ImageWithPreview,
  PhotoPreviewPortal,
} from "../components/PhotoPreviewPortal";

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
    <div
      className="container-lg"
      style={{ marginTop: "80px", marginBottom: "60px" }}
    >
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

  return (
    <div className="single-image container-sm">
      <ImageWithPreview photo={photoObject.name} />
    </div>
  );
};

const useRenderAst = (pageData: Data) => {
  const renderAST = new rehypeReact({
    createElement: React.createElement,
    components: {
      ["photo-grid" as any]: PhotoGridAdapter(pageData),
      ["photo" as any]: PhotoAdapter(pageData),
    },
  }).Compiler;
  return renderAST;
};

type ScreenProps = {
  data: Data;
};

const BannerImage = ({ data }: ScreenProps) => {
  if (!data.markdownRemark.frontmatter.banner) {
    return null;
  }

  return <ImageWithPreview photo={data.markdownRemark.frontmatter.banner} />;
};

const Banner = ({ data }: { data: Data }) => {
  if (!data.markdownRemark.frontmatter.banner) {
    return null;
  }

  return (
    <div className="banner container-md">
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <p>Posted on {data.markdownRemark.frontmatter.date}</p>
      <BannerImage data={data} />
    </div>
  );
};

const BlogPage = ({ data }: { data: Data }) => {
  const renderAST = useRenderAst(data);
  return (
    <PhotoPreviewPortal>
      <Header />
      <Banner data={data} />
      {renderAST(data.markdownRemark.htmlAst)}
    </PhotoPreviewPortal>
  );
};

export default BlogPage;
