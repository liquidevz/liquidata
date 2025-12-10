import React, { useState } from "react";
import { MaxWidthWrapper } from "../utils/MaxWidthWrapper";
import { Card } from "../utils/Card";
import { SiX } from "react-icons/si";
import { BubbleButton } from "../buttons/BubbleButton";
import { motion } from "framer-motion";
import { useWindowSize } from "../utils/useWindowSize";
import { CornerGrid } from "../utils/CornerGrid";
import { SectionHeading } from "../utils/SectionHeading";
import { SectionSubheading } from "../utils/SectionSubheading";
import { SectionHeadingSpacing } from "../utils/SectionHeadingSpacing";

export const Customers = () => {
  const { width } = useWindowSize();
  const [open, setOpen] = useState(false);

  const shouldCollapseColumns = width ? width <= 768 : false;

  return (
    <section id="testimonials" className="relative overflow-hidden">
      <MaxWidthWrapper className="relative z-10 py-20 md:py-40">
        <SectionHeadingSpacing>
          <SectionHeading>Hear from our clients</SectionHeading>
          <SectionSubheading>
            We're proud to have partnered with a diverse range of clients to
            deliver exceptional results.
          </SectionSubheading>
        </SectionHeadingSpacing>
        <motion.div
          initial={false}
          animate={open ? "open" : "closed"}
          style={{
            overflow: "hidden",
          }}
          variants={{
            open: {
              height: "fit-content",
            },
            closed: {
              height: 400,
            },
          }}
          className="relative grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          {shouldCollapseColumns ? (
            <>
              <ReviewsColumn
                reviews={[...REVIEWS.left, ...REVIEWS.center, ...REVIEWS.right]}
              />
            </>
          ) : (
            <>
              <ReviewsColumn reviews={REVIEWS.left} />
              <ReviewsColumn reviews={REVIEWS.center} />
              <ReviewsColumn reviews={REVIEWS.right} />
            </>
          )}

          <motion.div
            variants={{
              open: {
                top: "100%",
              },
              closed: {
                top: "0%",
              },
            }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-zinc-950/0 to-zinc-950"
          />
        </motion.div>
        <BubbleButton
          onClick={() => setOpen((pv) => !pv)}
          className="mx-auto mt-12"
        >
          {open ? "View less" : "View more"}
        </BubbleButton>
      </MaxWidthWrapper>
      <CornerGrid />
    </section>
  );
};

const ReviewsColumn = ({ reviews }: { reviews: typeof REVIEWS.left }) => {
  return (
    <div className="h-fit space-y-3">
      {reviews.map((r) => (
        <Card
          style={{
            padding: "20px",
          }}
          key={r.name}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <div className="relative flex items-center gap-2 py-2 text-xs">
              <img
                src={r.src}
                alt={`${r.name} profile picture`}
                className="size-8 rounded-full"
              />
              <div>
                <span className="block font-medium text-zinc-300">
                  {r.name}
                </span>
                <span className="block text-zinc-500">{r.handle}</span>
              </div>
            </div>

            <SiX className="text-sky-300" />
          </div>
          <p>{r.review}</p>
        </Card>
      ))}
    </div>
  );
};

const REVIEWS = {
  left: [
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      name: "Startup Inc.",
      handle: "@startupinc",
      review:
        "LiquiData's team was instrumental in launching our MVP. Their expertise in both software and hardware was a game-changer for us.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan",
      name: "Innovate Corp.",
      handle: "@innovatecorp",
      review:
        "The custom embedded system they developed for us has significantly improved our operational efficiency. Highly recommended!",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phil",
      name: "Tech Solutions",
      handle: "@techsolutions",
      review:
        "Working with LiquiData was a seamless experience. They delivered a high-quality mobile app on time and within budget.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andy",
      name: "Future Gadgets",
      handle: "@futuregadgets",
      review:
        "Their UI/UX design team is top-notch. They transformed our complex application into an intuitive and user-friendly product.",
    },
  ],
  center: [
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Steve",
      name: "Enterprise LLC",
      handle: "@enterprisellc",
      review:
        "LiquiData's cloud solutions have provided us with the scalability and reliability we needed to grow our business.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
      name: "Creative Minds",
      handle: "@creativeminds",
      review:
        "The team at LiquiData is professional, knowledgeable, and dedicated to client success. We're thrilled with the results.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul",
      name: "Global Connect",
      handle: "@globalconnect",
      review:
        "Their ability to handle both software and hardware development under one roof is a huge advantage. We'll definitely be working with them again.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phil",
      name: "NextGen Tech",
      handle: "@nextgentech",
      review:
        "From concept to deployment, LiquiData's team provided expert guidance and support. They are a true partner in innovation.",
    },
  ],
  right: [
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeff",
      name: "Data Systems",
      handle: "@datasystems",
      review:
        "The custom software they built for us has streamlined our processes and improved our productivity. We couldn't be happier.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jess",
      name: "Smart Devices",
      handle: "@smartdevices",
      review:
        "LiquiData's hardware expertise is unmatched. They designed and built a custom IoT device that has exceeded our expectations.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ben",
      name: "Visionary Apps",
      handle: "@visionaryapps",
      review:
        "Their attention to detail and commitment to quality are evident in the final product. We highly recommend LiquiData.",
    },
    {
      src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
      name: "Quantum Leap",
      handle: "@quantumleap",
      review:
        "We partnered with LiquiData on a complex project, and they delivered outstanding results. Their technical skills are impressive.",
    },
  ],
};
