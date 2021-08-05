import React, { useEffect, useRef, useState } from "react";
import layout from "justified-layout";

const containerWidth = 1080;

const l = layout(
  [
    1.33, 1, 0.65, 1, 0.65, 1.33, 1.33, 1, 0.65, 1.33, 1, 0.65, 1.33, 1, 0.65,
    1.33, 1, 0.65,
  ],
  {
    boxSpacing: 0,
    containerPadding: 0,
    containerWidth,
  }
);
const colours = ["red", "green", "blue"];

console.debug("layout", l);

const PhotoGrid = () => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "grey",
        display: "flex",
        flexWrap: "wrap",
        padding: "2.5px",
      }}
    >
      {l.boxes.map((b, i) => (
        <div
          style={{
            flex: `0 0 ${(b.width / containerWidth) * 100}%`,
            height: 80,
            display: "inline-block",
            padding: "2.5px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colours[i % colours.length],
            }}
          />
        </div>
      ))}
    </div>
  );
};

const IndexPage = () => {
  return <PhotoGrid />;
};

export default IndexPage;
