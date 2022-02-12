import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";
import { Footer, Header } from "../components";

export const query = graphql`
  query AboutQuery {
    aboutPhoto: file(relativePath: { eq: "DSCF4316.jpg" }) {
      childImageSharp {
        gatsbyImageData(
          placeholder: DOMINANT_COLOR
          formats: [AUTO, WEBP, AVIF]
          height: 600
        )
      }
    }
  }
`;

const aboutMe = [
  `
  My name is Lucian Boaca and I am a hobbyist photographer and software engineer, currently based in London, UK. 
  I enjoy capturing my surroundings and I use photography as a way to explore the places I find myself in.
  On this page you will find cityscapes, street photography and a blend of urban and nature scenes.
  `,
  `
  I started photography by being attracted to it's technical part, the mechanical complexity of a DSLR and interchangeable lenses.
  Something in the shutter sound, the mirror and prism mechanism, seeing the lenses moving while focusing and setting the exposure
  manually felt more special than just snapping a photo with a point and shoot or a smartphone. While this technical aspect still 
  plays a role in my passion for photography, I kept pursuing it for the ability to freeze a particular moment or scene in time and
  for the challenge to find interesting compositions, patterns and colours in day to day life and presenting them in the best 
  way possible.
  `,
  `
  My current gear consists of a Fujifilm X-T30 with a couple of Fuji lenses and some vintage manual focus lenses. 
  I find this set up to be very fun and quite inspiring to use.
  `,
];

const About = ({ data }) => {
  const image = data.aboutPhoto.childImageSharp;
  return (
    <>
      <Header />
      <div className="container-md">
        <div className="about">
          <section>
            <GatsbyImage alt="about-me" image={getImage(image)} />
          </section>
          <section>
            <h2>About</h2>
            {React.Children.toArray(aboutMe.map((p) => <p>{p}</p>))}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
