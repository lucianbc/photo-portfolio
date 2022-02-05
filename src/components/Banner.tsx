import React from "react";

type BannerProps = {
  title: string;
};

export const Banner = ({ title }: BannerProps) => {
  return (
    <div className="container-lg banner-page">
      <h1>{title}</h1>
    </div>
  );
};
