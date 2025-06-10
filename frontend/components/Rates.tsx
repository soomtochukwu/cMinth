import { useRates } from "@/hooks/use-rates";
import { Info } from "lucide-react";
import React from "react";

interface RatesProps {
  nftPrice: number;
}

const Rates = ({ nftPrice }: RatesProps) => {
  const //
    { error, ethToDollar, gettingRates, lskToDollar } = useRates();
  return (
    <div>
      <p className="text-2xl text-inherit  font-bold text-white">
        {Math.floor(
          (nftPrice * Number(ethToDollar)) / Number(lskToDollar)
        ).toLocaleString()}{" "}
        LSK
      </p>
      <div className="flex items-center space-x-4">
        <p className="text-slate-400 text-sm">
          ${Math.floor(nftPrice * Number(ethToDollar)).toLocaleString()}
        </p>
        <p className="text-slate-400 text-sm">
          {nftPrice.toLocaleString()} ETH
        </p>
        <p
          data-tooltip="Price data from CoinGecko API"
          className="relative group cursor-help inline-flex 
    before:content-[attr(data-tooltip)] before:absolute before:bottom-full before:left-1/2 
    before:transform before:-translate-x-1/2 before:mb-2 before:px-3 before:py-2 
    before:text-xs before:font-medium before:text-slate-400 before:bg-[#0b1023e7] 
    before:rounded-lg before:opacity-0 hover:before:opacity-100 
    before:transition-opacity before:duration-200 before:pointer-events-none 
    before:whitespace-nowrap before:z-10"
        >
          <Info className="text-slate-400" size={15} />
        </p>
      </div>
    </div>
  );
};

export default Rates;
