import React from "react";
import layout from "justified-layout";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import styled from "styled-components";
import { Link } from "gatsby";

type Props = {
  photos: {
    name: string;
    id: string;
    fields: {
      dimension: {
        aspectRatio: number;
      };
    };
  }[];
};

const breakPoints = [
  {
    // default - mobile
    mediaQuery: null,
    containerWidth: 400,
  },
  {
    // mobile landscape
    mediaQuery: 568,
    containerWidth: 600,
  },
  {
    // tablet
    mediaQuery: 834,
    containerWidth: 800,
  },
  {
    // laptop
    mediaQuery: 1200,
    containerWidth: 1080,
  },
  {
    // widescreen
    mediaQuery: 1900,
    containerWidth: 1900,
  },
];

export const PhotoGrid = ({ photos }: Props) => {
  const ratios = photos.map((p) => p.fields.dimension.aspectRatio);

  const layouts = breakPoints.map((breakPoint) => ({
    breakPoint,
    layout: layout(ratios, {
      boxSpacing: 0,
      containerPadding: 0,
      containerWidth: breakPoint.containerWidth,
    }),
  }));

  return (
    <GridContainer>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {React.Children.toArray(
          photos.map((photo, index) => (
            <PhotoBox
              responsiveRatios={layouts.map((l) => ({
                breakpoint: l.breakPoint.mediaQuery,
                ratio:
                  (l.layout.boxes[index].width / l.breakPoint.containerWidth) *
                  100,
              }))}
            >
              <Link to={`/photos/${photo.id}`}>
                <GatsbyImage
                  image={getImage(photo as any)}
                  alt={photo.name}
                  style={{ height: "100%", width: "100%" }}
                />
              </Link>
            </PhotoBox>
          ))
        )}
      </div>
    </GridContainer>
  );
};

type PhotoBoxProps = {
  readonly responsiveRatios: {
    breakpoint: number | null;
    ratio: number;
  }[];
};

const flexLine = (p: PhotoBoxProps["responsiveRatios"][number]) =>
  p.breakpoint === null
    ? `flex: 0 0 ${p.ratio}%;`
    : `@media (min-width: ${p.breakpoint}px) {
        flex: 0 0 ${p.ratio}%;
      }`;

const PhotoBox = styled.div<PhotoBoxProps>`
  ${(props) => {
    const s = props.responsiveRatios.map((r) => flexLine(r)).join("\n");
    return s;
  }}
  display: inline-block;
  padding: 5px;
  box-sizing: border-box;
  :hover {
    opacity: 0.9;
  }
  transition: all 0.2s;
`;

const GridContainer = styled.div`
  margin: -5px;
`;
