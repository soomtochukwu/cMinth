/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Minth_abi, Minth_address } from "../utils/var";
import { Function, Input } from "./_components/components";

const Page = () => {
  return (
    <div className="w-full flex flex-col text-center items-center">
      <ConnectButton></ConnectButton>
      {Minth_abi.map((field) => {
        return (
          <>
            {field.type == "function" ? (
              <div className="m-4 w-fit border rounded">
                <div className="">
                  {field.inputs.length
                    ? field.inputs.map((inputs, index) => {
                        return (
                          <Input
                            key={index}
                            type={inputs.type}
                            name={inputs.name}
                          />
                        );
                      })
                    : null}
                </div>

                <Function
                  abi={field}
                  name={field.name}
                  address={Minth_address}
                  args={field.inputs as []}
                />
              </div>
            ) : null}
          </>
        );
      })}
    </div>
  );
};

export default Page;
