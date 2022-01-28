import React from "react";
import { graphql, Link } from "gatsby";
import { Footer, PhotoGrid, ScrollHeader } from "../components";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import styled from "styled-components";

export const query = graphql`
  query IndexPageQuery {
    allFile(
      filter: { sourceInstanceName: { eq: "photos" } }
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
    heroPhoto: file(relativePath: { eq: "DSCF1715-2.jpg" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          formats: [AUTO, WEBP, AVIF]
        )
      }
    }
  }
`;

type ChildImageSharp = any;

type QueryResult = {
  allFile: {
    nodes: {
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

const WhoAmI = () => {
  return (
    <section
      className="container-sm text-center content-font-size"
      style={{
        paddingTop: "160px",
        paddingBottom: "90px",
      }}
    >
      <h2>Who am I</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </section>
  );
};

const IndexPage = ({ data }: { data: QueryResult }) => {
  return (
    <>
      <ScrollHeader />
      <Hero data={data.heroPhoto} />
      <WhoAmI />
      <section style={{ paddingTop: "0px" }}>
        <PhotoGrid photos={data.allFile.nodes.slice(0, 6)} />
      </section>
      <Footer />
    </>
  );
};

export default IndexPage;
