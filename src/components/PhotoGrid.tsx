import React from "react";
import layout from "justified-layout";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

type Props = {
  photos: {
    name: string;
    fields: {
      dimension: {
        aspectRatio: number;
      };
    };
  }[];
};

export const PhotoGrid = ({ photos }: Props) => {
  const containerWidth = 1080;
  const ll = layout(
    photos.map((p) => p.fields.dimension.aspectRatio),
    {
      boxSpacing: 0,
      containerPadding: 0,
      containerWidth,
    }
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {React.Children.toArray(
        ll.boxes.map((b, i) => (
          <div
            style={{
              flex: `0 0 ${(b.width / containerWidth) * 100}%`,
              display: "inline-block",
              padding: "5px",
              boxSizing: "border-box",
            }}
          >
            <GatsbyImage
              image={getImage(photos[i] as any)}
              alt={photos[i].name}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        ))
      )}
    </div>
  );
};
