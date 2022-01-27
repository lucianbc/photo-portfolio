import React, { useCallback, useEffect, useState } from "react";
import { Header } from "./Header";
import "./ScrollHeader.scss";

type Props = {
  heightPercentage?: number;
};

export const ScrollHeader: React.FC<Props> = ({ heightPercentage = 0.5 }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const listenToScroll = useCallback(() => {
    let heightToHideFrom = heightPercentage * window.innerHeight;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      setShown(true);
    } else {
      setShown(false);
    }
  }, []);

  return (
    <div
      className={`scrollHeader ${shown ? "show" : ""}`}
      style={{ position: "fixed", zIndex: 999, width: "100%" }}
    >
      <Header />
    </div>
  );
};
