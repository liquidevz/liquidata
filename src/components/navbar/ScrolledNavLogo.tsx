import Image from "next/image";

export const ScrolledNavLogo = () => {
  return (
    <Image
      src="/liquidata.svg"
      alt="Liquidata"
      width={32}
      height={34}
      className="ml-2 fill-zinc-50"
      priority
    />
  );
};

