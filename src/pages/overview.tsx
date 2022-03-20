import React, { useState } from "react";
import { graphql, Link } from "gatsby";
import { TwitterLogo } from "../components/TwitterLogo";
import { InstaLogo } from "../components/InstaLogo";
import { PhotoGrid } from "../components/ResponsivePhotoGrid";
import { PhotoPreviewPortal } from "../components/PhotoPreviewPortal";
import "./overview.scss";
import { ScrollHeader } from "../components/ScrollHeader";
import { Hamburger } from "../components";

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

const SideNavigation = ({ id, className = undefined }) => {
  return (
    <nav id={id} className={className}>
      <Link to="/">
        <h2>Lucian Boaca | Photography</h2>
      </Link>
      <ul>
        <li>
          <Link to="/">Overview</Link>
        </li>
        <li>
          <Link to="/">Albums</Link>
        </li>
        <li>
          <Link to="/">About</Link>
        </li>
      </ul>
      <div>
        <h3>Social</h3>
        <div>
          <InstaLogo />
          <TwitterLogo />
        </div>
      </div>
    </nav>
  );
};

const SideNavLayout = ({ children }) => {
  const [sideNavRevealed, setSideNavRevealed] = useState(false);
  return (
    <PhotoPreviewPortal>
      <div className="side-nav-layout container-lg">
        <header id="mobile-header">
          <div className="container-lg">
            <Link to="/">Lucian Boaca | Photography</Link>
            <Hamburger
              active={sideNavRevealed}
              onClick={() => setSideNavRevealed((s) => !s)}
            />
          </div>
        </header>
        <main>{children}</main>
        <SideNavigation
          id="desktop-nav"
          className={sideNavRevealed ? "shown" : undefined}
        />
      </div>
    </PhotoPreviewPortal>
  );
};

export default ({ data }) => {
  return (
    <SideNavLayout>
      <div className="content-wrapper">
        <PhotoGrid photos={data.feed.images} />
      </div>
    </SideNavLayout>
  );
};
