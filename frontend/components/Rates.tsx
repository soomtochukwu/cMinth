import { useRates } from "@/hooks/use-rates";
import { Info } from "lucide-react";
import React from "react";

interface RatesProps {
  nftPrice: number;
}

const Rates = ({ nftPrice }: RatesProps) => {
  const //
    { error, ethToDollar, gettingRates, lskToDollar } = useRates(),
    roundDownDynamically = function (num: number) {
      if (num === 0) return "0";
      return parseFloat(num.toFixed(18)).toString();
    };

  return (
    <div>
      <div className="text-2xl text-inherit font-bold text-white">
        {gettingRates ? (
          <Spinner />
        ) : (
          Math.floor(
            (nftPrice * Number(ethToDollar)) / Number(lskToDollar)
          ).toLocaleString()
        )}{" "}
        LSK
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-slate-400 text-sm">
          {gettingRates ? (
            <Spinner />
          ) : (
            `$${(nftPrice * Number(ethToDollar)).toFixed(1).toLocaleString()}`
          )}
        </div>
        <div className="text-slate-400 text-sm">
          {gettingRates ? <Spinner /> : roundDownDynamically(nftPrice) + " ETH"}
        </div>
        <div
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
        </div>
      </div>
    </div>
  );
};

export const Spinner = () => {
  return (
    <div className="flex items-center space-x-2 text-slate-400 text-sm">
      <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-slate-400 rounded-full"></span>
    </div>
  );
};

export default Rates;
