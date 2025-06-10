import { useEffect, useState } from "react";

interface Rates {
    lskToDollar: number | null;
    ethToDollar: number | null;
    gettingRates: boolean;
    error: string | null;
}

export function useRates(): Rates {
    const [lskToDollar, setLskToDollar] = useState<number | null>(null);
    const [ethToDollar, setEthToDollar] = useState<number | null>(null);
    const [gettingRates, setGettingRates] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRates = async () => {
            setGettingRates(true);
            setError(null);
            try {
                // Using CoinGecko API for simplicity
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=lisk,ethereum&vs_currencies=usd"
                );
                if (!res.ok) throw new Error("Failed to fetch rates");
                const data = await res.json();
                setLskToDollar(data.lisk?.usd ?? null);
                setEthToDollar(data.ethereum?.usd ?? null);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setGettingRates(false);
            }
        };
        fetchRates();
    }, []);

    return { lskToDollar, ethToDollar, gettingRates, error };
}