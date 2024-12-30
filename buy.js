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

export async function buyToken(privateKey, tokenAddress, amount) {

    const keypair = getKeyPairFromPrivateKey(privateKey)
    const mint = new PublicKey(tokenAddress);
    const SLIPPAGE_BASIS_POINTS = BigInt('2000');
    const BUY_AMOUNT_SOL = parseFloat(amount);

    const provider = getProvider(keypair);
    const sdk = new PumpFunSDK(provider);

    const buyResults = await sdk.buy(
        keypair,
        mint,
        BigInt(BUY_AMOUNT_SOL * LAMPORTS_PER_SOL),
        SLIPPAGE_BASIS_POINTS,
        {
            unitLimit: 250000,
            unitPrice: 250000,
        },
        'confirmed',
        'finalized'
    );

    // await new Promise(resolve => setTimeout(resolve, 5000));

    // const connection = provider.connection;
    // const associatedTokenAccount = await getAssociatedTokenAddress(new PublicKey(tokenAddress), keypair.publicKey);
    // const accountInfo = await connection.getParsedAccountInfo(associatedTokenAccount);

    // if (accountInfo.value) {
    //     const data = accountInfo.value.data;
    //     const tokenAmount = parseFloat(data.parsed.info.tokenAmount.amount) / Math.pow(10, data.parsed.info.tokenAmount.decimals);
    //     if (tokenAmount > 0) {
    //         return { success: true, amount: tokenAmount };
    //     } else {
    //         console.log('Purchase failed or zero tokens received.');
    //     }
    // } else {
    //     console.log('Associated token account does not exist. Purchase likely failed.');
    // }

    return buyResults;
}