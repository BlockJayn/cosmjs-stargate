// Source:
// https://github.com/cosmostation/cosmosjs
// https://cosmos.github.io/cosmjs/latest/stargate/classes/StargateClient.html              Only for Querys
// https://cosmos.github.io/cosmjs/latest/stargate/classes/SigningStargateClient.html       For Signing TXs (you can query with this one too)
// https://gist.github.com/webmaster128/8444d42a7eceeda2544c8a59fbd7e1d9                    CosmJS Guided Tour
// https://github.com/cosmos/cosmjs#using-custom-stargate-modules
// https://codesandbox.io/examples/package/@cosmjs/stargate
// https://www.npmjs.com/package/@cosmjs/launchpad/v/0.26.5                                 Cosmjs Launchpad
// https://www.youtube.com/watch?v=jXo5VWlvP84                                              From Beginner to Building Your Own Blockchain
// https://github.com/cosmostation/cosmosjs/blob/master/example/juno.js                     Example juno.js


// ToDo:
// - Generate Juno and other wallets?
// - Send from juno address to juno address
// - Un/Delegate Token to Validator
// - Calling Contracts
// - Generate Token?
// - Generate Multisig Wallet
// - Am I creating wallets correctly? Are they derived correctly? Can I see a master-cosmos-wallet and it's derived ones with via query?
// - generate Wallet - get Account doesnt return the right juno-adress from the mnemonic it generates? I compared them and they dont show the same public key
// - how to convert denom balances == parseCoins(balance.amount+balance.denom) .... Takes a coins list like "819966000ucosm,700000000ustake" and parses it.


// - Fix: Error Sending Transaction:  Error: Gas price must be set in the client options when auto gas is used.


import config from "./config.json" assert { type: "json" };
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";
import {
    assertIsDeliverTxSuccess,
    SigningStargateClient,
    coin,
    coins,
    parseCoins
} from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";

const rpcEndpoint = "https://rpc.juno.omniflix.co";
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    config.wallet.mnemonic,
    { prefix: "juno" }          // Defaults to "cosmos"
);

const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet
);
const [firstAccount] = await wallet.getAccounts();

// Init Console Info
console.log("\n#####    You are using:     #####\n");
console.log("Wallet:       " + firstAccount.address);
console.log("Mnemonic:     " + wallet.secret);
console.log("RPC:          " + rpcEndpoint + "\n");


// Generate New Wallet
async function generateNewWallet(wordLength) {
    if (!wordLength) {
        wordLength = 18;
    }

    //const path = stringToPath("m/44'/118'/0'/0/0");
    //console.log(makeCosmoshubPath(0))
    //console.log(path)

    /*
    if (
        wordLength !== 12 ||
        wordLength !== 15 ||
        wordLength !== 18 ||
        wordLength !== 21 ||
        wordLength !== 24
    ) {
        console.error("Error generating wallet: The word length of your mnemonic must be 12 | 15 | 18 | 21 | 24")
        return false
    }
*/

    const newWallet = await DirectSecp256k1HdWallet.generate(wordLength, {
        bip39Password: "ethics demise chase differ combine swim either focus dry media fine fun young luggage jump guide virtual upper",        // Do i really derive from this cosmos mnemonic, or should I use the seedphrase?
        //hdPaths: makeCosmoshubPath(0),    // hdPaths are throwing an error, but obviously it's doing correct default by just not using "hdPath" within the object... Defaults to the Cosmos Hub/ATOM path m/44'/118'/0'/0/0
        prefix: "juno"                      // The prefix is NOT "juno1" as expected, but "juno", defaults to "cosmos"

        /*
        hdPath: [
                [Slip10RawIndex],
                [Slip10RawIndex],
                [Slip10RawIndex],
                [Slip10RawIndex],
                [Slip10RawIndex]
                ],
        prefix: 'juno'
        */

    });
    const [{ address }] = await newWallet.getAccounts();

    console.log("\n#####    Generating Wallet     #####\n");
    console.log("Mnemonic:     " + newWallet.mnemonic);
    console.log("Address:      " + address + "\n");

    return {
        mnemonic: newWallet.mnemonic,
        address: address
    }
}
//generateNewWallet(18);


// Get all Transactions from Block-Number
async function getBlockTransactions(blockNr) {
    const blockTx = await client.getBlock(blockNr);
    console.log(blockTx);
    return blockTx;
}
//getBlockTransactions(5136535)

// Get the Chain-ID
async function getChainId() {
    const chainID = await client.getChainId();
    console.log(chainID);
    return chainID;
}
//getChainId()

// Get Account from Address
async function getAccount(address) {
    const account = await client.getAccount(address);
    console.log("\n#####     Account Details for: " + address + "\n");
    console.log(account);
    return account;
}
//getAccount("juno1ukhkqrzaxlunvrqr26kmf8fddpq46pf0v50lqm")

// Get All Balances from Address
async function getAllBalances(address) {
    const balances = await client.getAllBalances(address);
    console.log("\n#####     All Balances from: " + address + "\n");
    console.log(balances);
    return balances;
}
//getAllBalances("juno1ukhkqrzaxlunvrqr26kmf8fddpq46pf0v50lqm")

// Get specific Coin-Balance from Address
async function getBalance(address, coin) {
    const balance = await client.getBalance(address, coin);
    console.log("\n#####     " + coin + "-Balance for: " + address + "\n");
    console.log(balance);
    return balance;
}
getBalance(firstAccount.address, "ujuno")

// Get Staked Balance from Address
async function getBalanceStaked(address) {
    const stakedBalance = await client.getBalanceStaked(address);
    console.log(stakedBalance);
    return stakedBalance;
}
getBalanceStaked(firstAccount.address)

// Get Block Details and Transactions
async function getBlock(blocknumber) {
    const block = await client.getBlock(blocknumber);
    console.log(block);
    return block;
}
//getBlock(5136535)

// Get Delegation from Address @ Validator
async function getDelegation(delegatorAddress, validatorAddress) {
    const delegation = await client.getDelegation(
        delegatorAddress,
        validatorAddress
    );
    console.log(delegation);
    return delegation;
}
//getDelegation("juno1slef2ex8a878j0prx26gjrjjveurterxgvsnpl","<VALIDATORADDRESS>")

// Get Current Block Height
async function getCurrentBlockHeight() {
    const height = await client.getHeight();
    console.log(height);
    return height;
}
//getCurrentBlockHeight()

// Get Sequence from Address
async function getSequence(address) {
    const sequence = await client.getSequence(address);
    console.log(sequence);
    return sequence;
}
//getSequence("juno1slef2ex8a878j0prx26gjrjjveurterxgvsnpl")

// Search Transaction   - NOT TESTED YET -     // searchTx(query: SearchTxQuery, filter?: SearchTxFilter): Promise<readonly IndexedTx[]>
/*
async function searchTx(query) {
    const foundTx = await client.getTx(query)
    console.log(foundTx)
    return foundTx
}
searchTx()
*/

// Get Transaction & Details
async function getTx(txhash) {
    const txRaw = await client.getTx(txhash);
    const txRawLog = txRaw.rawLog;
    const txRawLogParsed = JSON.parse(txRawLog); // Parse the rawLog from the transaction

    //console.log("\n#####     Raw Log of Transaction     #####\n")
    //console.log(txRawLog)

    console.log("\n#####     Transaction Details: " + txhash + "\n");

    txRawLogParsed.map((object) => {
        for (let key in object) {
            let objectKey = object[key];

            if (Array.isArray(objectKey)) {
                objectKey.map((keyObject) => {
                    console.log(keyObject);
                });
            }
        }
    });
    return txRawLogParsed;
}
//getTx("0A3CF84AC9DEC4B5248A3D50168A01C90A2D1256E9ABE6D6199433D136173174")

// Send Tokens
async function sendTokens(fromAddress, toAddress, sendAmount, fee, memo) {

    // Check Balance of Sender Address
    const fromAddressBalance = await getBalance(fromAddress, sendAmount.denom)

    if (fromAddressBalance < sendAmount.amount) {
        console.error("Error Sending Tokens: You don't have enough tokens in your wallet.")
        return false
    }

    console.log("\n#####     Sending Tokens     #####\n");
    console.log("From:    " + fromAddress);
    console.log("To:      " + toAddress);
    console.log("Amount:  " + sendAmount.amount + " " + sendAmount.denom);
    console.log("Memo:    " + memo + "\n");

    // senderAddress: string,   recipientAddress: string,    amount: readonly Coin[],     fee: number | StdFee | "auto",      memo?: string | undefined): Promise<DeliverTxResponse>
    try {
        const result = await client.sendTokens(
            fromAddress,  // senderAddress: string
            toAddress,  // recipientAddress: string
            coins(sendAmount.amount, sendAmount.denom),                          // amount: readonly Coin[]
            {                                               // fee: number | StdFee | "auto"
                amount: coins(fee.gasAmount, fee.denom),
                gas: fee.gasFee
            },
            memo                                // memo?: string | undefined): Promise<DeliverTxResponse>
        );
        assertIsDeliverTxSuccess(result);   // Ensures the given result is a success. Throws a detailed error message otherwise.

        console.log("\n#####     Transaction Sent Successfully!     #####\n");
        console.log(result)

        return result

    } catch (error) {
        console.error("Error Sending Transaction: ", error)
    }

}
/*
sendTokens(
    firstAccount.address,
    "juno1slef2ex8a878j0prx26gjrjjveurterxgvsnpl",
    { amount: "100000", denom: "ujuno" },
    { gasAmount: "30000", denom: "ujuno", gasFee: "100000" },
    "Have fun with your coins"
);
*/

// Delegate Tokens
async function delegateTokens(delegatorAddress, validatorAddress, delegateAmount, fee, memo) {

    console.log("\n#####     Delegating Tokens     #####\n");
    console.log("From:    " + delegatorAddress);
    console.log("To:      " + validatorAddress);
    console.log("Amount:  " + delegateAmount.amount + " " + delegateAmount.denom);
    console.log("Memo:    " + memo + "\n");

    // delegateTokens(delegatorAddress: string, validatorAddress: string, amount: Coin, fee: number | StdFee | "auto", memo?: string): Promise<DeliverTxResponse>
    try {
        const result = await client.delegateTokens(
            delegatorAddress,  // senderAddress: string
            validatorAddress,  // recipientAddress: string
            coin(delegateAmount.amount, delegateAmount.denom),                          // amount: readonly coin
            {                                               // fee: number | StdFee | "auto"
                amount: coins(fee.gasAmount, fee.denom),
                gas: fee.gasFee
            },
            memo                                // memo?: string | undefined): Promise<DeliverTxResponse>
        );
        assertIsDeliverTxSuccess(result);   // Ensures the given result is a success. Throws a detailed error message otherwise.

        console.log("\n#####     Delegation Sent Successfully!     #####\n");
        console.log(result)

        return result

    } catch (error) {
        console.error("Error Sending Transaction: ", error)
    }
}
delegateTokens(
    firstAccount.address,
    "junovaloper13qjgwewgrwu979wn8xxrh274rjtwk4m5gqkehp",
    { amount: "100000", denom: "ujuno" },
    { gasAmount: "150000", denom: "ujuno", gasFee: "150000" },
    ""
)