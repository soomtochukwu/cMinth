import React from "react";

interface InputProps {
  type: string;
  name: string;
}

interface FunctionProps {
  name: string;
}
export const Function = ({ name }: FunctionProps) => {
  return <button className="bg-green-500 p-2 rounded"> {name}</button>;
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
