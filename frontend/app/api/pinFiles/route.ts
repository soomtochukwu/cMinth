import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: process.env.PINATA_GATEWAY!,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const mainFile = formData.get('mainFile') as File;
        const artworkFile = formData.get('artworkFile') as File | null;
        const title = formData.get('title') as string;

        if (!mainFile || !title) {
            return NextResponse.json(
                { error: 'Main file and title are required' },
                { status: 400 }
            );
        }

        const results: string[] = [];

        // Upload main file
        const mainFileName = `${title}_main${mainFile.name.substring(
            mainFile.name.lastIndexOf('.')
        )}`;
        const mainFileToUpload = new File([mainFile], mainFileName, {
            type: mainFile.type,
        });

        const mainUpload = await pinata.upload.public.file(mainFileToUpload);
        results.push(mainUpload.cid);

        // Upload artwork if provided
        if (artworkFile) {
            const artworkFileName = `${title}_cover${artworkFile.name.substring(
                artworkFile.name.lastIndexOf('.')
            )}`;
            const artworkFileToUpload = new File([artworkFile], artworkFileName, {
                type: artworkFile.type,
            });

            const artworkUpload = await pinata.upload.public.file(artworkFileToUpload);
            results.push(artworkUpload.cid);
        }

        return NextResponse.json({ cids: results });
    } catch (error) {
        console.error('Error uploading files to Pinata:', error);
        return NextResponse.json(
            { error: 'Failed to upload files to IPFS' },
            { status: 500 }
        );
    }
}
