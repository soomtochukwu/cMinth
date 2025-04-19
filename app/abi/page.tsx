/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { Minth_abi } from "../utils/var";
import { Function, Input } from "./_components/components";

const Page = () => {
  return (
    <div className="w-full flex flex-col text-center items-center">
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
                <Function name={field.name} />
              </div>
            ) : null}
          </>
        );
      })}
    </div>
  );
};

export default Page;
