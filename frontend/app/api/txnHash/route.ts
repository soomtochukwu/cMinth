import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const txnHashStorePath = path.join(process.cwd(), 'app/api/txnHash/MintTxHashes.json');

// Handle GET requests
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get('id');

        if (!idParam) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        const id = Number(idParam);
        const fileContent = readFileSync(txnHashStorePath, 'utf-8');
        const data = JSON.parse(fileContent);

        const txnHash = data[id];

        if (!txnHash) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 404 });
        }

        return NextResponse.json({ txnHash });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}

// Handle POST requests

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate that body has only one key-value pair
        const keys = Object.keys(body);
        // if (keys.length !== 1) {
        //     return NextResponse.json(
        //         { error: 'Request body must contain exactly one { id: txnHash } pair' },
        //         { status: 400 }
        //     );
        // }
        // "Error: ENOENT: no such file or directory, open '/home/maziofweb3/cds/ps/LISK_Africa_Bootcamp/Final Project/Cr8or-frontend/frontend/api/txnHash/MinttxnHashes.json'"

        const
            // 
            _id = keys[0],
            _txnHash = keys[1],
            id = body[_id],
            txnHash = body[_txnHash];
        /* 

        const id = keys[0];
        const txnHash = body[id];
         */

        if (typeof txnHash !== 'string') {
            return NextResponse.json({ error: 'txnHash must be a string' }, { status: 400 });
        }

        // Read and parse the existing file
        const fileContent = readFileSync(txnHashStorePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Add or overwrite the entry
        data[id] = txnHash;

        // Save updated file
        writeFileSync(txnHashStorePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ message: 'txnHash saved successfully', [id]: txnHash });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}