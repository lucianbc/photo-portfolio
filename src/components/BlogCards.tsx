import React from "react";
import { Link } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import "./BlogCards.scss";

type BlogNodes = {
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

export const BlogCards: React.FC<BlogNodes> = ({ nodes }) => {
  return (
    <div className="posts-section">
      {nodes.map((node) => {
        return (
          <Link
            to={node.fields.slug}
            style={{ textDecoration: "none", color: "inherit" }}
            key={node.fields.slug}
          >
            <article className="blog-card">
              <GatsbyImage
                image={getImage(node.frontmatter.banner as any)}
                alt={node.frontmatter.title}
                style={{ width: "100%" }}
              />
              <h3>{node.frontmatter.title}</h3>
              <p>{node.frontmatter.date}</p>
            </article>
          </Link>
        );
      })}
    </div>
  );
};
