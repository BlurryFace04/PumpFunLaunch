import fs from 'fs';
import { PinataSDK } from "pinata-web3";

import dotenv from "dotenv";

dotenv.config();

// Initialize IPFS client
const PINATA_JWT = process.env.IPFS_JWT;
const GATEWAY_URL = "ivory-select-squirrel-480.mypinata.cloud";

const pinata = new PinataSDK({
    pinataJwt: PINATA_JWT,
    pinataGateway: GATEWAY_URL
});

async function uploadImage(filePath) {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        const fileName = `image-${Math.random().toString(36).substring(2)}.png`; // Unique file name for the image
        const file = new File([imageBuffer], fileName, { type: "image/png" });
        const upload = await pinata.upload.file(file);
        console.log(upload);

        return upload.IpfsHash;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export async function uploadToIPFS(filePath, jsonMetadata) {
    try {
        // Upload the image
        const imageIpfsHash = await uploadImage(filePath);
        jsonMetadata.image = `https://${GATEWAY_URL}/ipfs/${imageIpfsHash}`;

        // Prepare JSON metadata with a unique filename
        const fileName = `metadata-${Math.random().toString(36).substring(2)}.json`; // Unique file name for metadata
        const upload = await pinata.upload.json(jsonMetadata, { name: fileName });
        console.log(upload);

        // Construct final IPFS URI
        const uri = `https://${GATEWAY_URL}/ipfs/${upload.IpfsHash}`;

        return uri;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
}
