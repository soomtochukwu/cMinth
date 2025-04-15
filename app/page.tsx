"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import {
  useAccount,
  // useEstimateGas,
  useWatchContractEvent,
  // useWriteContract,
  useWalletClient,
} from "wagmi";
import { ethers } from "ethers";
import { Minth_abi, Minth_address } from "./utils/var";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { PinataSDK } from "pinata";
import Link from "next/link";
import Progress from "./components/Progress";
import axios from "axios";

export default function Home() {
  const //

    { data: walletClient } = useWalletClient(),
    [image, setImage] = useState<File | null>(null),
    [imageUrl, setImageUrl] = useState<string | null>(null),
    [stage, setStage] = useState<string | null>(null),
    { address, isConnected } = useAccount(),
    // { writeContractAsync } = useWriteContract(),
    pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_JWT,
      pinataGateway: process.env.NEXT_PUBLIC_gate,
    }),
    pinImage = async () => {
      try {
        setStage("pinning");

        const //
          NFT_image = await (async () => {
            const pin = await pinata.upload.file(image as File);
            setStage("1st stage");
            await console.log(pin.IpfsHash);
            return pin;
          })(),
          metadata = {
            attributes: [
              {
                trait_type: "Name",
                value: `${(image as File).name}`,
              },
              {
                trait_type: "Owner",
                value: address,
              },
            ],
            description: `Minted for ${address} by Minth`,
            // @ts-ignore
            image: `ipfs://${NFT_image.IpfsHash}`,
            name: address?.slice(0, 6),
          },
          metadataBlob = new Blob([JSON.stringify(metadata)], {
            type: "application/json",
          }),
          file2 = new File(
            [metadataBlob],
            `metadata_${(image as File).name}.json`,
            {
              type: "application/json",
            }
          ),
          NFT_image_Metadata = await (async () => {
            const pin = await pinata.upload.file(file2);
            setStage("2nd stage");
            await console.log(pin.IpfsHash);
            setStage("pinned");
            return pin;
          })();
        return NFT_image_Metadata;
      } catch (error) {
        // @ts-ignore
        console.log(error.message);
      }
    },
    Minth = async () => {
      if (!walletClient) return;
      console.log(address, isConnected);
      if (imageUrl || image) {
        console.log("> minting!");
        setStage("minting");
        const NFT = await pinImage();

        try {
          setStage("mining");

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            Minth_address,
            Minth_abi,
            signer
          );

          const tx = await contract.safeMint(`ipfs://${NFT?.IpfsHash}`);
          console.log("> submitted at", tx.hash);

          await tx.wait(); // Wait for confirmation

          setStage("completed");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          console.error(e.message || e.shortMessage || e);
          setStage("error");
        }
      } else {
        alert("upload and image or enter a valid url");
        // @ts-ignore
        document.getElementById("url").focus();
        return 0;
      }
    };
  //
  /*  useEstimateGas({
    to: "0x884c8cC437bD61C7d7Ed04720F60d657E0eCdbE3",
    data: contract.encodeFunctionData("safeMint", [
      "bafkreieazyy36z6gdapq5zbusfkdu2amnw56hzxoekviu32eddm3mr2yiu",
    ]),
  }); */
  //
  useWatchContractEvent({
    address: Minth_address,
    abi: Minth_abi,
    eventName: "MINTH",
    onLogs(nft) {
      console.log("NFT minted", nft);
      setStage("minted");
      alert("YOUR NFT WILL APPEAR IN YOUR");
      setTimeout(() => {
        setStage(null);
      }, 3000);
    },
  });
  //
  useEffect(() => {
    if (imageUrl && image) {
      const imgPre: HTMLElement = document.getElementById(
        "imagePreview"
      ) as HTMLElement;
      (
        document.getElementById("imagePreview") as HTMLElement
      ).style.transition = "0.7s";
      imgPre.style.width = "100%";
      imgPre.style.height = "100%";
    }
  }, [image]);
  return (
    <div className="h-screen">
      <div className="backdrop-blur-md text-center md:fixed w-full font-bold p-6 text-2xl md:text-5xl font-sans">
        <Link href={"/"}>Welcome to Minth</Link>
        <div className="font-extralight text-xs md:text-sm ">
          ...Turn your fav. images into NFTs 😃
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:h-full p-3 h-fit justify-center items-center  md:space-x-7 *:mt-7">
        {/* left pane */}
        <div className="flex dark bg-gray-100 border flex-col justify-center items-center space-y-7 md:min-w-96 md:min-h-96 rounded-xl shadow-gray-600 shadow-2xl  p-5">
          <div className="w-full">
            <div className="text-center">Upload Images</div>
            <input
              type="file"
              className="dark w-full bg-gray-100 active:scale-95 p-3 shadow-gray-600 shadow-inner rounded-md"
              accept="image"
              onInput={(e) => {
                if (imageUrl) {
                  (
                    document.getElementById("imagePreview") as HTMLElement
                  ).style.transition = "0s";
                  (
                    document.getElementById("imagePreview") as HTMLElement
                  ).style.width = "0px";
                  (
                    document.getElementById("imagePreview") as HTMLElement
                  ).style.height = "0px";
                }
                // @ts-ignore
                const file = e.target.files[0];
                console.log(file);
                console.log(URL.createObjectURL(file));
                setImageUrl(URL.createObjectURL(file));
                setImage(file);
              }}
            />
          </div>
          {/*  */}
          <div className="text-center">Or</div>
          <div className="w-full">
            <input
              placeholder="Paste Image URL"
              className="dark border text-center w-full p-3 bg-gray-100 rounded-md shadow-gray-600 shadow-inner"
              type="url"
              id="url"
              onInput={async (e) => {
                const val = e.currentTarget.value;
                setImageUrl(val);

                // setImageUrl(val);
                if (imageUrl) {
                  (
                    document.getElementById("imagePreview") as HTMLElement
                  ).style.transition = "0s";
                  (
                    document.getElementById("imagePreview") as HTMLElement
                  ).style.width = "0px";
                  (
                    document.getElementById("imagePreview") as HTMLElement
                  ).style.height = "0px";
                }
                await axios
                  .get(val, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    const file = new File(
                      [res.data],
                      `${val.slice(val.lastIndexOf("/") + 1)}`,
                      { type: res.data.type }
                    );
                    setImageUrl(val);
                    setImage(file);
                    console.log(file);
                  })
                  .catch((e) => {
                    alert(e.message);
                  });
              }}
            />
          </div>
          <div id="">
            <ConnectButton chainStatus={"icon"} accountStatus={"avatar"} />
          </div>
          <button
            onClick={async () => {
              if (!imageUrl) {
                alert("YOU MUST PROVIDE AN IMAGE");
              }
              //
              //
              if (address && isConnected) {
                Minth();
              } else {
                alert("Please connect your wallet and try again");
              }
            }}
            className="p-3 px-10 rounded-md active:scale-95 bg-gray-700 text-white"
          >
            Mint now!
          </button>
          <div className="h-7 w-full">
            <Progress
              progressBarBG={"bg-gray-700"}
              color={"text-gray-400"}
              stages={[
                "pinning",
                "1st stage",
                "2nd stage",
                "pinned",
                "minting",
                "mining",
                "minted",
              ]}
              currentStage={stage as string}
            />
          </div>
        </div>

        {/* right pane */}
        <div className="tr dark bg-gray-100 flex justify-center items-center shadow-gray-600 shadow-2xl md:min-w-96 md:min-h-96 w-fit border rounded-xl">
          <div className=" absolute ">
            <pre>
              {imageUrl
                ? `Loading \n${imageUrl
                    ?.slice(imageUrl.lastIndexOf("/") + 1)
                    .slice(0, 20)}`
                : "Your NFT will be previewed here"}
            </pre>
          </div>
          {imageUrl ? (
            <img
              id="imagePreview"
              className="z-10 rounded-2xl mh"
              alt="Preview"
              src={imageUrl}
              // width={500}
              // height={500}
            ></img>
          ) : null}
        </div>

        {/*  */}
      </div>
    </div>
  );
}
