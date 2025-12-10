import React from "react";
import {
  FiCalendar,
  FiCheck,
  FiCloud,
  FiDollarSign,
  FiMoon,
  FiWatch,
} from "react-icons/fi";
import { IconType } from "react-icons";

export const SimpleGrid = () => (
  <div className="relative z-10 grid grid-cols-2 gap-9 px-3 md:grid-cols-3 md:gap-12 md:px-6">
    <Item
      Icon={FiCalendar}
      title="Streamlined Planning"
      subtitle="Our structured approach ensures your project stays on track with clear timelines and milestones."
    />
    <Item
      Icon={FiWatch}
      title="Rapid Development"
      subtitle="Accelerate your time-to-market with our efficient development processes and proven methodologies."
    />
    <Item
      Icon={FiMoon}
      title="Peace of Mind"
      subtitle="Rest assured knowing your project is in expert hands with 24/7 support and maintenance."
    />
    <Item
      Icon={FiDollarSign}
      title="Cost-Effective Solutions"
      subtitle="Get maximum value with our transparent pricing and efficient resource allocation strategies."
    />
    <Item
      Icon={FiCloud}
      title="Scalable Infrastructure"
      subtitle="Build on robust, cloud-native architectures that grow with your business needs."
    />
    <Item
      Icon={FiCheck}
      title="Complete Solutions"
      subtitle="From concept to deployment, we provide end-to-end software and hardware development services."
    />
  </div>
);

const Item = ({
  Icon,
  title,
  subtitle,
}: {
  Icon: IconType;
  title: string;
  subtitle: string;
}) => {
  return (
    <div>
      <h4 className="mb-1.5 flex items-start text-lg font-medium md:text-xl">
        <Icon className="mr-1.5 h-[26px] text-blue-300" />
        {title}
      </h4>
      <p className="text-sm text-zinc-400 md:text-base">{subtitle}</p>
    </div>
  );
};
