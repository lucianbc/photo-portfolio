import React from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

export const AlbumCard = ({ childImageSharp, alt, destination, title }) => {
  return (
    <div className="aspect-square relative">
      <GatsbyImage image={getImage(childImageSharp)!} alt={alt} />
      <Link
        to={destination}
        className="group absolute top-0 bottom-0 left-0 right-0"
      >
        <div className="transition-all group-hover:opacity-100 opacity-0 absolute top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] text-white backdrop-blur-sm">
          <div className="flex justify-center items-center h-[100%]">
            <p className="translate-y-6 group-hover:translate-y-0 transition-all">
              {title}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const AlbumContainer = ({ children }) => {
  return (
    <main className="container grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </main>
  );
};
