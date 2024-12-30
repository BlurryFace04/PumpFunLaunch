import { PumpFunSDK } from "pumpdotfun-sdk";
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getKeyPairFromPrivateKey } from "./utils.js";
import { getAssociatedTokenAddress } from '@solana/spl-token';

import dotenv from "dotenv";
dotenv.config();


const getProvider = (keypair) => {
    if (!process.env.HELIUS_RPC_URL) {
        throw new Error("Please set HELIUS_RPC_URL in .env file");
    }
    const RPC_URL = process.env.HELIUS_RPC_URL;
    const connection = new Connection(RPC_URL, "confirmed");
    const wallet = new Wallet(keypair);
    return new AnchorProvider(connection, wallet, { commitment: "finalized" });
};

export async function sellToken(privateKey, tokenAddress, tokenAmount) {

    const keypair = getKeyPairFromPrivateKey(privateKey)
    const mint = new PublicKey(tokenAddress);
    const SLIPPAGE_BASIS_POINTS = BigInt('2000');

    const provider = getProvider(keypair);
    const sdk = new PumpFunSDK(provider);

    const buyResults = await sdk.sell(
        keypair,
        mint,
        BigInt(tokenAmount * 1000000),
        SLIPPAGE_BASIS_POINTS,
        {
            unitLimit: 250000,
            unitPrice: 250000,
        },
        'confirmed',
        'finalized'
    );


    return buyResults;
}