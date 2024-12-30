import { uploadToIPFS } from "./ipfs.js";
import { launchToken } from "./launchToken.js";
import { buyToken } from "./buy.js"
import { getPriceAndMarketCap } from './price_Mcap.js';
import { sellToken } from "./sell.js";
import dotenv from "dotenv";

dotenv.config();

const deployerPrivatekey = process.env.PRIVATE_KEY; // Replace with your actual private key
const tokenSymbol = process.env.SYMBOL; //Replace with actual token symbol
const tokenName = process.env.NAME; //Replace with actual token name
const description = process.env.DESCRIPTION; //Replace with actual token name
const filePath = process.env.IMAGE_PATH; // Replace with your image path
const twitter = process.env.TWITTER;
const telegram = process.env.TELEGRAM;
const website = process.env.WEBSITE;

const jsonMetadata = {
    name: tokenName,
    symbol: tokenSymbol,
    description: description,
    showName: true,
    createdOn: "https://pump.fun",
    twitter: twitter,
    telegram: telegram,
    website: website,
};

async function launchTokenExample() {
    // costs 0.0178 SOL
    const result = await uploadToIPFS(filePath, jsonMetadata);
    console.log('Upload Results:', result);
    const launchTokenExample = await launchToken(deployerPrivatekey, result, tokenSymbol, tokenName);
}


async function buyTokenExample() {
    // costs variable, set at 0.01 SOL
    const tokenAddressToBuy = "5pS8bGqXyG5n17rF1mJ3W2yQ3pisNiievAPAFEkXpump";
    const result = await buyToken(deployerPrivatekey, tokenAddressToBuy, "0.01");

}

async function getPriceAndMcap(){
    const tokenAddressToBuy = "5pS8bGqXyG5n17rF1mJ3W2yQ3pisNiievAPAFEkXpump";    
    const {price, mcap} = await getPriceAndMarketCap(tokenAddressToBuy);
}

async function sellTokenExample() {
    // costs variable, set at 0.01 SOL
    const tokenAddressToBuy = "5pS8bGqXyG5n17rF1mJ3W2yQ3pisNiievAPAFEkXpump";
    const result = await sellToken(deployerPrivatekey, tokenAddressToBuy, "356680");

}

// await launchTokenExample();
// await buyTokenExample();
// await getPriceAndMcap();
// await sellTokenExample();
