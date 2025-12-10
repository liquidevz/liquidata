import Link from "next/link";
import Image from "next/image";

export const NavLogo = () => {
  return (
    <Link href="/">
      <Image
        src="/liquidata.svg"
        alt="Liquidata"
        width={150}
        height={32}
        className="fill-zinc-200"
        priority
      />
    </Link>
  );
};
