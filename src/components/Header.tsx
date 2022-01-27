import React from "react";
import { Link } from "gatsby";
import { useState } from "react";

export const Header = () => {
  const [mobileToggleState, setState] = useState<
    "active" | "inactive" | undefined
  >();
  return (
    <nav className="surface">
      <header className="container-lg">
        <Link to="/">Lucian Boaca | Photography</Link>

        <span
          className={`mobile-nav-toggle ${mobileToggleState}`}
          onClick={() => {
            const nextState =
              mobileToggleState === undefined ||
              mobileToggleState === "inactive"
                ? "active"
                : "inactive";
            setState(nextState);
          }}
        >
          <span className="one" />
          <span className="two" />
          <span className="three" />
        </span>

        <ul className={mobileToggleState === "active" ? "active" : ""}>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/feed">Feed</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </header>
    </nav>
  );
};
