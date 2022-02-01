import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

type Props = {
  children: React.ReactNode;
};

type ImageSharp = any;

type PortalData =
  | {
      state: "empty";
    }
  | {
      state: "visible";
      photo: ImageSharp;
    };

type PortalContext = {
  data: PortalData;
  openPhoto: (photo: ImageSharp) => void;
  closePortal: () => void;
};

const initialValue: PortalContext = {
  data: { state: "empty" },
  openPhoto: () => {},
  closePortal: () => {},
};

const PortalContext = React.createContext<PortalContext>(initialValue);

export const usePhotoPortal = () => {
  return useContext(PortalContext);
};

export const PhotoPreviewPortal: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState(initialValue.data);
  const openPhoto = useCallback((photo: ImageSharp) => {
    setData({ state: "visible", photo });
  }, []);
  const closePortal = useCallback(() => {
    setData({ state: "empty" });
  }, []);

  return (
    <PortalContext.Provider value={{ data, openPhoto, closePortal }}>
      {children}
      {data.state === "visible" ? <PhotoPreview photo={data.photo} /> : null}
    </PortalContext.Provider>
  );
};

const disableScroll = () => {
  document.body.classList.add("no-scroll");
};

const reEnableScroll = () => {
  document.body.classList.remove("no-scroll");
};

type AllPhotos = {
  allFile: {
    nodes: {
      childImageSharp: {
        gatsbyImageData: any;
      };
      name: string;
      id: string;
    }[];
  };
};

const useFindPhoto = () => {
  const allPhotos: AllPhotos = useStaticQuery(graphql`
    query AllPhotos {
      allFile(filter: { sourceInstanceName: { eq: "photos" } }) {
        nodes {
          childImageSharp {
            gatsbyImageData(
              width: 1800
              placeholder: DOMINANT_COLOR
              formats: [AUTO, WEBP, AVIF]
            )
          }
          id
          name
        }
      }
    }
  `);
  const findSizedPhoto = (photo: ImageSharp) => {
    return allPhotos.allFile.nodes.find(
      (sizedNode) => sizedNode.id === photo.id
    );
  };

  return findSizedPhoto;
};

const PhotoPreview: React.FC<{ photo: ImageSharp }> = ({ photo }) => {
  const { closePortal } = usePhotoPortal();
  useEffect(() => {
    disableScroll();
    return reEnableScroll;
  }, []);

  const closeOnEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePortal();
      }
    },
    [closePortal]
  );
  useEffect(() => {
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  });

  return (
    <PhotoPreviewContainer onClick={closePortal}>
      <GatsbyImage
        image={getImage(photo as any)}
        alt={photo.name}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        objectFit="contain"
      />
    </PhotoPreviewContainer>
  );
};

type ImageWithPreviewProps = {
  photo: ImageSharp;
};

export const ImageWithPreview: React.FC<ImageWithPreviewProps> = ({
  photo,
}) => {
  const { openPhoto } = usePhotoPortal();
  const image = getImage(photo);
  return (
    <span onClick={() => openPhoto(photo)} style={{ cursor: "pointer" }}>
      <GatsbyImage
        image={image}
        alt={photo.name}
        style={{ height: "100%", width: "100%" }}
      />
    </span>
  );
};

const fadeInAnim = keyframes`
  0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`;

const PhotoPreviewContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 1);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  opacity: 1;
  animation-name: ${fadeInAnim};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.05s;
`;
