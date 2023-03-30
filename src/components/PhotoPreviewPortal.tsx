import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import styled, { keyframes } from "styled-components";

type Props = {
  children: React.ReactNode;
};

type ImageSharp = {
  id: string;
  [k: string]: any;
};

type PrevNext = {
  [k: string]: ImageSharp;
};

const computeNextAndPrev = (photoCollection: ImageSharp[]) => {
  const next: PrevNext = {};
  const prev: PrevNext = {};
  let prevPhoto: ImageSharp | null = null;
  let crtPhoto: ImageSharp | null = null;

  for (const photo of photoCollection) {
    prevPhoto = crtPhoto;
    crtPhoto = photo;

    if (prevPhoto && crtPhoto) {
      prev[crtPhoto.id] = prevPhoto;
      next[prevPhoto.id] = crtPhoto;
    }
  }

  if (photoCollection.length >= 2) {
    const first = photoCollection[0];
    const last = photoCollection[photoCollection.length - 1];
    next[last.id] = first;
    prev[first.id] = last;
  }

  return {
    next,
    prev,
  };
};

type PortalData =
  | {
      state: "empty";
    }
  | {
      state: "visible";
      photo: ImageSharp;
      prevNextMap: {
        next: PrevNext;
        prev: PrevNext;
      };
    };

type PortalContext = {
  data: PortalData;
  openPhoto: (photo: ImageSharp, photoCollection?: ImageSharp[]) => void;
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
  const openPhoto = useCallback(
    (photo: ImageSharp, photoCollection?: ImageSharp[]) => {
      const prevNextMap = photoCollection
        ? computeNextAndPrev(photoCollection)
        : undefined;
      //@ts-ignore
      setData({ state: "visible", photo, prevNextMap });
    },
    []
  );
  const closePortal = useCallback(() => {
    setData({ state: "empty" });
  }, []);

  const nav =
    data.state === "visible"
      ? (() => {
          const prevPhoto = data.prevNextMap.prev[data.photo.id];
          const nextPhoto = data.prevNextMap.next[data.photo.id];

          const setPhoto = (photo: ImageSharp) =>
            photo
              ? () =>
                  setData((crt) => ({
                    ...crt,
                    photo,
                  }))
              : undefined;
          return {
            goToNext: setPhoto(nextPhoto),
            goToPrev: setPhoto(prevPhoto),
          };
        })()
      : undefined;

  return (
    <PortalContext.Provider value={{ data, openPhoto, closePortal }}>
      {children}
      {data.state === "visible" ? (
        //@ts-ignore
        <PhotoPreview photo={data.photo} {...nav} />
      ) : null}
    </PortalContext.Provider>
  );
};

const disableScroll = () => {
  document.body.classList.add("no-scroll");
};

const reEnableScroll = () => {
  document.body.classList.remove("no-scroll");
};

type MaybeCb = (() => void) | undefined;

const PhotoPreview: React.FC<{
  photo: ImageSharp;
  goToNext: MaybeCb;
  goToPrev: MaybeCb;
}> = ({ photo, goToNext, goToPrev }) => {
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
            if (isPrev && goToPrev) {
              goToPrev();
            }
            if (!isPrev && goToNext) {
              goToNext();
            }
          }
        }}
      >
        {goToPrev ? (
          <div className="nav-container">
            <div className="nav-btn prev">
              <span />
              <span />
            </div>
          </div>
        ) : null}
        <div className="photo-box-wrapper">
          <div className="photo-box">
            <GatsbyImage
              image={getImage(photo as any)!}
              alt={photo.name}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              objectFit="contain"
            />
          </div>
        </div>

        {goToNext ? (
          <div className="nav-container">
            <div className="nav-btn next">
              <span />
              <span />
            </div>
          </div>
        ) : null}
      </div>
    </PhotoPreviewContainer>
  );
};

type ImageWithPreviewProps = {
  photo: ImageSharp;
  photoCollection?: ImageSharp[];
};

export const ImageWithPreview: React.FC<ImageWithPreviewProps> = ({
  photo,
  photoCollection,
}) => {
  const { openPhoto } = usePhotoPortal();
  const image = getImage(photo as any);
  if (!photo.name) console.debug("alt is undefined in ", photo, photo.name);

  return (
    <span
      onClick={() => openPhoto(photo, photoCollection)}
      style={{ cursor: "pointer" }}
    >
      <GatsbyImage
        image={image!}
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
  z-index: 99998;
  padding: 20px;

  display: flex;
  flex-direction: column;

  color: white;

  & .close-row {
    position: fixed;
    z-index: 99999;
    top: 10px;
    right: 10px;
    > .close-button {
      display: inline-block;
      padding: 10px;
      cursor: pointer;
      > div {
        position: relative;
        width: 25px;
        height: 25px;
        > .bar {
          position: absolute;
          top: 50%;
          width: 100%;
          height: 1px;
          display: block;
          background-color: white;
          border-radius: 100px;
        }
        > .one {
          transform: rotate(40deg);
        }
        > .two {
          transform: rotate(-40deg);
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

        & > span {
          &:first-child {
            transform: rotate(-40.5deg);
            transform-origin: right;
          }

          &:last-child {
            transform: rotate(40.5deg);
            transform-origin: right;
          }
        }
      }

      &.prev {
        margin-right: 10px;

        & > span {
          &:first-child {
            transform: rotate(40.5deg);
            transform-origin: left;
          }

          &:last-child {
            transform: rotate(-40.5deg);
            transform-origin: left;
          }
        }
      }
    }
  }

  .nav-container {
    display: none;
  }

  @media (min-width: 800px) {
    .nav-container {
      display: flex;
    }
  }

  opacity: 1;
  animation-name: ${fadeInAnim};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.05s;
`;
