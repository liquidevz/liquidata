import { motion } from "framer-motion";

export const Logos = () => {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden border-b border-zinc-700 py-4 md:py-6">
      <span className="mx-auto mb-6 md:mb-9 block w-fit bg-gradient-to-br from-zinc-200 to-zinc-500 bg-clip-text text-center text-sm md:text-lg text-transparent px-4">
        Trusted by companies of all sizes
      </span>
      <div className="flex overflow-hidden">
        <TranslateWrapper>
          <LogoItems />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItems />
        </TranslateWrapper>
        <div className="hidden md:flex">
          <TranslateWrapper>
            <LogoItems />
          </TranslateWrapper>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 top-0 w-1/2 md:w-1/3 max-w-32 md:max-w-64 bg-gradient-to-r from-zinc-950 to-zinc-950/0" />
      <div className="absolute bottom-0 right-0 top-0 w-1/2 md:w-1/3 max-w-32 md:max-w-64 bg-gradient-to-l from-zinc-950 to-zinc-950/0" />
    </section>
  );
};

const TranslateWrapper = ({
  children,
  reverse,
}: {
  children: JSX.Element;
  reverse?: boolean;
}) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex gap-12 md:gap-12 px-4 md:px-6"
    >
      {children}
    </motion.div>
  );
};

const LogoItems = () => (
  <>
    {/* <LogoOne /> */}
    <LogoTwo />
    <LogoThree />
    <LogoFour />
  </>
);

const LogoOne = () => (
  <img 
    src="/logo-one.png" 
    alt="Logo One" 
    width={162} 
    height={32} 
    className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
  />
);

const LogoTwo = () => (
  <img 
    src="/roomdekhho.png" 
    alt="Logo Two" 
    width={141} 
    height={32} 
    className="h-6 md:h-8 w-auto max-w-24 md:max-w-none opacity-60 hover:opacity-100 transition-opacity"
  />
);

const LogoThree = () => (
  <img 
    src="/Rangaone.png" 
    alt="Logo Three" 
    width={175} 
    height={32} 
    className="h-6 md:h-8 w-auto max-w-24 md:max-w-none opacity-60 hover:opacity-100 transition-opacity"
  />
);

const LogoFour = () => (
  <img 
    src="/Brewy.png" 
    alt="Logo Four" 
    width={150} 
    height={32} 
    className="h-5 md:h-8 w-auto max-w-20 md:max-w-none opacity-60 hover:opacity-100 transition-opacity"
  />
);
