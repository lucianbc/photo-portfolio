import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

  const photoNavRef = useRef<HTMLDivElement>(null);

  return (
    <PhotoPreviewContainer>
      <div className="close-row">
        <span className="close-button" onClick={closePortal}>
          <div>
            <span className="bar one" />
            <span className="bar two" />
          </div>
        </span>
      </div>
      <div
        ref={photoNavRef}
        className="photo-and-nav"
        onClick={(e) => {
          const rect = photoNavRef.current?.getBoundingClientRect();

          if (rect) {
            const position = { x: e.clientX - rect.x, y: e.clientY - rect.y };
            const box = { width: rect.width, height: rect.height };
            const isPrev = position.x < box.width / 2;
            console.debug("event here", e.clientX, e.pageX, rect.x);
          }
        }}
      >
        <div className="nav-container">
          <div className="nav-btn prev">
            <span />
            <span />
          </div>
        </div>
        <div className="photo-box-wrapper">
          <div className="photo-box">
            <GatsbyImage
              image={getImage(photo as any)}
              alt={photo.name}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              objectFit="contain"
            />
          </div>
        </div>

        <div className="nav-container">
          <div className="nav-btn next">
            <span />
            <span />
          </div>
        </div>
      </div>
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
  if (!photo.name) console.debug("alt is undefined in ", photo, photo.name);
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
  padding: 20px;

  display: flex;
  flex-direction: column;

  color: white;

  & .close-row {
    display: flex;
    justify-content: flex-end;
  }

  & .close-button {
    width: 25px;
    height: 25px;

    display: block;

    position: relative;
    z-index: 1;
    padding: 30px;
    margin: -30px;

    & > div {
      position: relative;
      height: 100%;

      cursor: pointer;

      & > .bar {
        width: 100%;
        display: block;
        height: 2px;
        background-color: white;
        position: absolute;

        border-radius: 3px;

        &.one {
          top: 0;
          transform: rotate(45deg);
          transform-origin: left;
        }

        &.two {
          bottom: 5.5px;
          transform: rotate(-45deg);
          transform-origin: left;
        }
      }
    }
  }

  & .photo-and-nav {
    display: flex;
    width: 100%;
    flex-grow: 1;
  }

  & .photo-box-wrapper {
    position: relative;
    flex-grow: 1;
  }

  & .photo-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .nav-container {
    display: flex;
    align-items: center;
    justify-content: center;

    & .nav-btn {
      width: 30px;
      height: 40px;

      cursor: pointer;
      position: relative;

      & span {
        position: absolute;
        width: 100%;
        background-color: white;
        height: 2px;
        border-radius: 2px;

        & :first-child {
          top: 0;
        }

        & :last-child {
          bottom: 0;
        }
      }

      &.next {
        margin-left: 10px;

        & span {
          & :first-child {
            transform: rotate(40.5deg);
            transform-origin: left;
          }

          & :last-child {
            transform: rotate(-40.5deg);
            transform-origin: left;
          }
        }
      }

      &.prev {
        margin-right: 10px;

        & span {
          & :first-child {
            transform: rotate(-40.5deg);
            transform-origin: right;
          }

          & :last-child {
            transform: rotate(40.5deg);
            transform-origin: right;
          }
        }
      }
    }
  }

  opacity: 1;
  animation-name: ${fadeInAnim};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.05s;
`;
