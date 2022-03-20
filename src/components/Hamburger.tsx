import React from "react";
import "./Hamburger.scss";

export const Hamburger = ({ onClick, active }) => {
  return (
    <span className={`hamburger ${active ? "active" : ""}`} onClick={onClick}>
      <div className="touch-area" />
      <span className="one" />
      <span className="two" />
      <span className="three" />
    </span>
  );
};
