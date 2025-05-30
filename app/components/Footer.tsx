import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Minth_address } from "../utils/var";

const Footer = () => {
  return (
    <div className="h-14 backdrop-blur-md md:flex justify-center items-center  md:sticky *:bg-gray-700 *:p-1 *:px-3 *:w-fit *:text-white *:rounded-md lg:space-x-36 *:inline-flex *:m-1 md:space-x-10 md:bottom-0 w-full text-center">
      <div className="">use desktop for best experience</div>

      <div>Meet me {"  -->"}</div>

      <Link target="meetMe" href={"https://somtochukwu-ko.vercel.app/"}>
        Portfolio 🛄
      </Link>
      <Link
        target="meetMe"
        className="flex"
        href={"https://github.com/soomtochukwu/cMinth/"}
      >
        Github{"    "}
        <Image
          src={"/octocat.png"}
          width={20}
          height={5}
          alt={":octocat:"}
        ></Image>
      </Link>

      <Link
        target="meetMe"
        href={`https://celo-alfajores.blockscout.com/token/${Minth_address}`}
      >
        The smart contract 🧩
      </Link>
    </div>
  );
};

export default Footer;
