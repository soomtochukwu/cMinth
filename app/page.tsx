/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import * as React from "react";

import { useEffect, useState } from "react";
import {
  useAccount,
  // useEstimateGas,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { Minth_abi, Minth_address } from "./utils/var";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { PinataSDK } from "pinata";
import Link from "next/link";
import Progress from "./components/Progress";
import axios from "axios";
import DrawModal from "./components/DrawModal";

export default function Home() {
  const //
    [image, setImage] = useState<File | null>(null),
    [isModalOpen, setModalOpen] = useState(false),
    [imageUrl, setImageUrl] = useState<string | null>(null),
    [stage, setStage] = useState<string | null>(null),
    { address, isConnected } = useAccount(),
    { writeContractAsync } = useWriteContract(),
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
      console.log(address, isConnected);
      if (imageUrl || image) {
        console.log("> minting!");
        setStage("minting");
        const NFT = await pinImage();
        await writeContractAsync({
          abi: Minth_abi,
          address: Minth_address,
          functionName: "safeMint",
          // @ts-ignore
          args: [`ipfs://${NFT.IpfsHash}`],
        })
          .then((tx) => {
            console.log("> submitted at", tx);
            setStage("mining");
          })
          .catch((e) => {
            console.log(e.message | e.shortMessage);
          });
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
      alert("YOUR NFT WILL APPEAR IN YOUR WALLET");
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

  useEffect(() => {
    if (!isModalOpen) document.getElementById("inn")?.click();
  }, [isModalOpen]);
  return (
    <div className="h-screen">
      <div className="backdrop-blur-md text-center md:fixed w-full font-bold p-6  font-sans">
        <Link href={"/"} className="text-2xl md:text-5xl">
          Welcome to Minth
        </Link>
        <div className="font-extralight text-xs md:text-sm ">
          ...Turn your fav. images into NFTs 😃
        </div>
        <div className="fixed right-0 -mt-16 mr-6">
          <ConnectButton
            chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "avatar",
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: false,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:h-full p-3 h-fit justify-center items-center  md:space-x-7 *:mt-7">
        {/* left pane */}
        <div className="flex dark bg-gray-100 border flex-col justify-center items-center space-y-7 md:min-w-96 md:min-h-96 rounded-xl shadow-gray-600 shadow-2xl  p-5">
          <DrawModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">Hello from Modal!</h2>
            <p>This is some modal content.</p>
          </DrawModal>
          <div className="w-full">
            <div className="text-center">Upload Images</div>
            <input
              type="file"
              id="inn"
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
            <br />
            <br />

            <div className="text-center">Or</div>
            <br />
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
            >
              Draw and upload your own NFT(s)
            </button>
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
        <div className="tr dark bg-gray-100 flex justify-center items-center shadow-gray-600 shadow-2xl md:min-w-96 md:min-h-96 w-fit border rounded-xl max-w-2xl">
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
            ></img>
          ) : null}
        </div>
      </div>

      {/*  */}
    </div>
  );
}
