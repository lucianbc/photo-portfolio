import React from "react";

<<<<<<< HEAD
export const Footer = () => (
  <footer
    style={{
      width: "95%",
      margin: "auto",
      paddingLeft: "5px",
      paddingTop: "10px",
      paddingBottom: "10px",
      textAlign: "center",
      fontSize: "0.8rem",
    }}
  >
    All images &#169; 2020 - 2021 Lucian Boaca - All rights reserved
  </footer>
);
=======
export const Footer = () => {
  return (
      <footer className="mt-12 text-gray-800 text-sm uppercase container flex justify-center flex-col items-center">
        <span className="block w-3/5 h-[1px] bg-gray-400"/>
        <section className="my-8">
           © Lucian Boaca, 2023
        </section>
      </footer>
  );
};
>>>>>>> 6024232 (Reimplement v2 UI)
