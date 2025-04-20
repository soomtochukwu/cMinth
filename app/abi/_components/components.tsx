/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { useWriteContract } from "wagmi";

interface InputProps {
  type: string;
  name: string;
}

interface FunctionProps {
  name: string;
  abi: object;
  address: string;
  args: [];
}
export const Function = ({ name, abi, address }: FunctionProps) => {
  const // //
    { writeContractAsync } = useWriteContract();
  return (
    <button
      className="bg-green-500 p-2 rounded"
      onClick={async () => {
        writeContractAsync({
          // @ts-ignore
          abi: abi,
          address: address as `0x{string}`,
          functionName: name,
          args: [],
        });
      }}
    >
      {" "}
      {name}
    </button>
  );
};
export const Input = ({ type, name }: InputProps) => {
  return (
    <input
      placeholder={name}
      className="m-2 text-center text-gray-400 block rounded"
      type={type}
      name={name}
    />
  );
};
