import React from "react";
import { InstaLogo } from "./InstaLogo";
import { TwitterLogo } from "./TwitterLogo";

export const Footer = () => (
  <footer className="color-secondary">
    <div className="container-lg">
      <div>
        <h2>Social</h2>
        <div>
          <InstaLogo />
          <TwitterLogo />
        </div>
      </div>
      <div>
        <p>All images &#169; 2020 - 2022 Lucian Boaca - All rights reserved</p>
      </div>
    </div>
  </footer>
);
