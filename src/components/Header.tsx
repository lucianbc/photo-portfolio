import { Link } from "gatsby";
import React from "react";

export const Header = () => {
  return (
    <header className="mt-9 mb-7">
      <div className="container">
        <nav className="md:flex md:items-baseline md:justify-between font-title block text-center">
          <Link to="/"><h1 className="text-3xl">Lucian Boaca | Photography</h1></Link>
        </nav>
      </div>
    </header>
  );
};
