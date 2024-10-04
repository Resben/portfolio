import { SpacemanCanvas } from ".";

const Hero = ({ scrollContainer }) => {
  return (
    <section className="main-canvas">
      <SpacemanCanvas scrollContainer={scrollContainer} />
    </section>
  );
};

export default Hero;
