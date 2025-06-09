import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: process.env.PINATA_GATEWAY!,
});

export async function POST(request: NextRequest) {
    try {
        const { fileHashes, nftData } = await request.json();

        if (!fileHashes || !nftData) {
            return NextResponse.json(
                { error: 'File hashes and NFT data are required' },
                { status: 400 }
            );
        }

        // Construct metadata object
        const metadata = {
            id: nftData.id,
            title: nftData.title,
            name: nftData.title,
            description: nftData.description,
            creator: nftData.creator,
            price: nftData.price,
            // Handle image and audio URLs based on NFT type
            ...(nftData.type === 'audio'
                ? {
                    audio: `https://ipfs.io/ipfs/${fileHashes[0]}`,
                    image: fileHashes[1]
                        ? `https://ipfs.io/ipfs/${fileHashes[1]}`
                        : `https://ipfs.io/ipfs/${fileHashes[0]}`,
                }
                : {
                    image: `https://ipfs.io/ipfs/${fileHashes[0]}`
                }),
            type: nftData.type,
            tags: nftData.tags,
            createdAt: nftData.createdAt,
            tokenId: nftData.tokenId,
            owner: nftData.owner,
            attributes: [
                {
                    trait_type: 'Name',
                    value: nftData.title,
                },
                {
                    trait_type: 'Owner',
                    value: nftData.owner,
                },
                {
                    trait_type: 'Creator',
                    value: nftData.creator,
                },
                {
                    trait_type: 'Type',
                    value: nftData.type,
                },
            ],
        };

        // Create metadata file
        const metadataFile = new File(
            [JSON.stringify(metadata, null, 2)],
            `metadata_${nftData.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`,
            {
                type: 'application/json',
            }
        );

        // Upload metadata to IPFS
        const metadataUpload = await pinata.upload.public.file(metadataFile);

        return NextResponse.json({ cid: metadataUpload.cid });
    } catch (error) {
        console.error('Error uploading metadata to Pinata:', error);
        return NextResponse.json(
            { error: 'Failed to upload metadata to IPFS' },
            { status: 500 }
        );
    }
}