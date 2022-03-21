import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import "./AlbumCard.scss";
import { Link } from "gatsby";

type GatsbyImage = {
  childImageSharp: {
    gatsbyImageData: any;
  };
};

type Props = {
  banner: GatsbyImage;
  title: string;
};

export const AlbumCard = ({ banner, title }: Props) => {
  const image = getImage(banner.childImageSharp.gatsbyImageData);
  return (
    <article className="album-card">
      <Link to="/">
        <div className="overlay">
          <h3>{title}</h3>
        </div>
        <GatsbyImage image={image} alt={title} />
      </Link>
    </article>
  );
};
