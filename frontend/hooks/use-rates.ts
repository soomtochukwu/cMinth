import { useEffect, useState } from "react";

interface Rates {
  celoToDollar: number | null;
  ethToDollar: number | null;
  gettingRates: boolean;
  error: string | null;
  fetched: boolean;
}

export function useRates(): Rates {
  const //
    [celoToDollar, setCeloToDollar] = useState<number>(0.4),
    [ethToDollar, setEthToDollar] = useState<number>(2418.22),
    [gettingRates, setGettingRates] = useState(true),
    [error, setError] = useState<string | null>(null),
    [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchRates = async () => {
      if (fetched) {
        return { celoToDollar, ethToDollar, gettingRates, error };
      }
      setGettingRates(true);
      setError(null);
      try {
        // Using CoinGecko API for simplicity
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=celo,ethereum&vs_currencies=usd"
        );
        if (!res.ok) throw new Error("Failed to fetch rates");
        setFetched(true);
        const data = await res.json();
        setCeloToDollar(data.celo?.usd ?? null);
        setEthToDollar(data.ethereum?.usd ?? null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setGettingRates(false);
      }
    };
    fetchRates();
  }, []);

  return { celoToDollar, ethToDollar, gettingRates, error, fetched };
}
