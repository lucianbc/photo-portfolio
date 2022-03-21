import React, { useState } from "react";
import { Link } from "gatsby";
import { InstaLogo } from "./InstaLogo";
import { TwitterLogo } from "./TwitterLogo";
import { PhotoPreviewPortal } from "./PhotoPreviewPortal";
import { Hamburger } from "./Hamburger";
import "./SideNavLayout.scss";

const SideNavigation = ({ id, className = undefined }) => {
  return (
    <nav id={id} className={className}>
      <Link to="/">
        <h2>Lucian Boaca | Photography</h2>
      </Link>
      <ul>
        <li>
          <Link to="/overview">Overview</Link>
        </li>
        <li>
          <Link to="/albums">Albums</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
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

export const SideNavLayout = ({ children }) => {
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
