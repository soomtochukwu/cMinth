// app/api/nft-metadata/route.ts

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Replace with your preferred Alfajores RPC endpoint (e.g., from https://docs.celo.org)
const CELO_RPC = 'https://alfajores-forno.celo-testnet.org';
const CONTRACT_ADDRESS = '0x2115BbF22546fa362AE58Bf47A52d70a66596624';

const abi = [
    'function totalSupply() view returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)',
];

async function fetchMetadata(uri: string) {
    try {
        // Handle IPFS links
        const gatewayUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        const res = await fetch(gatewayUrl);
        return await res.json();
    } catch (err) {
        console.error('Failed to fetch metadata for URI:', uri);
        return null;
    }
}

export async function GET() {
    try {
        const provider = new ethers.JsonRpcProvider(CELO_RPC);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

        const totalSupply: number = await contract.totalSupply();
        const promises = [];

        for (let i = 0; i < totalSupply; i++) {
            promises.push(
                contract.tokenURI(i).then(fetchMetadata)
            );
        }

        const metadataList = await Promise.all(promises);

        // Remove any null entries in case of fetch failures
        const filtered = metadataList.filter(Boolean);

        return NextResponse.json(filtered);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch NFT metadata' }, { status: 500 });
    }
}
