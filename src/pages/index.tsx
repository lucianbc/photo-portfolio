import React from "react";
import { graphql, Link } from "gatsby";
import { BlogCards, Footer, PhotoGrid, ScrollHeader } from "../components";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import styled from "styled-components";
import { PhotoPreviewPortal } from "../components/PhotoPreviewPortal";

export const query = graphql`
  query IndexPageQuery {
    heroPhoto: file(name: { eq: "DSCF1715" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          formats: [AUTO, WEBP, AVIF]
        )
      }
    }
    index {
      feedPreview {
        childImageSharp {
          gatsbyImageData(
            width: 1800
            placeholder: DOMINANT_COLOR
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
    allMarkdownRemark(limit: 6, sort: { fields: fields___slug, order: DESC }) {
      nodes {
        frontmatter {
          title
          date
          banner {
            childImageSharp {
              gatsbyImageData(
                width: 300
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

type ChildImageSharp = any;

type QueryResult = {
  index: {
    feedPreview: {
      name: string;
      id: string;
      childImageSharp: ChildImageSharp;
      fields: {
        dimension: {
          height: number;
          width: number;
          aspectRatio: number;
        };
      };
    }[];
  };
  heroPhoto: {
    childImageSharp: ChildImageSharp;
  };
  allMarkdownRemark: {
    nodes: {
      frontmatter: {
        title: string;
        date: string;
        banner: {
          childImageSharp: {
            gatsbyImageData: any;
          };
        };
      };
      fields: {
        slug: string;
      };
    }[];
  };
};

const Hero: React.FC<{ data: any }> = ({ data }) => {
  const bg = getImage(data);

  return (
    <section style={{ display: "grid", height: "100vh", position: "relative" }}>
      <GatsbyImage image={bg} alt="none" objectFit="cover" />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexDirection: "column",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Lucian Boaca | Photography</h1>
        <HeroLinks>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/feed">Feed</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </HeroLinks>
      </div>
    </section>
  );
};

const HeroLinks = styled.ul`
  display: flex;
  padding: 0;
  > li {
    list-style-type: none;
    margin-right: 20px;
    position: relative;

    &:last-child {
      margin-right: 0;
    }

    &::after {
      content: "";
      position: absolute;
      height: 2px;
      background-color: white;
      left: 0;
      width: 0%;
      bottom: -2px;
      transition: width 0.5s;
      transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    &:hover {
      &::after {
        width: 100%;
      }
    }

    > a {
      color: inherit;
      text-decoration: none;
    }
  }
`;

const Highlights = ({ data }: { data: QueryResult }) => {
  return (
    <section className="padded-vertical color-secondary">
      <div className="container-md">
        <PhotoGrid photos={data.index.feedPreview as any} />
      </div>
    </section>
  );
};

const RecentPosts = ({ data }: { data: QueryResult }) => {
  return (
    <section className="padded-vertical">
      <div className="container-md">
        <h2>Recent posts</h2>
        <BlogCards nodes={data.allMarkdownRemark.nodes} />
        <Link to="/blog" className="underlined-anim underlined-anim-black">
          View more
        </Link>
      </div>
    </section>
  );
};

const IndexPage = ({ data }: { data: QueryResult }) => {
  return (
    <PhotoPreviewPortal>
      <ScrollHeader />
      <Hero data={data.heroPhoto} />
      <Highlights data={data} />
      <RecentPosts data={data} />
      <Footer />
    </PhotoPreviewPortal>
  );
};

export default IndexPage;
