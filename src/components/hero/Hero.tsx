import { GradientGrid } from "./GradientGrid";
import { Beams } from "../utils/Beams";
import { Content } from "./Content";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16">
      <Content />
      <Beams />
      <GradientGrid />
    </section>
  );
};
