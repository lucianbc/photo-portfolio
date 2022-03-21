import React from "react";
import { SideNavLayout } from "../components";

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

const About = () => {
  return (
    <SideNavLayout>
      <section className="container-sm left-aligned">
        <h2>About</h2>
        {React.Children.toArray(aboutMe.map((p) => <p>{p}</p>))}
      </section>
    </SideNavLayout>
  );
};

export default About;
