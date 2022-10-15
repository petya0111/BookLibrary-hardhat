const hre = require("hardhat");
const ethers = hre.ethers;

async function deployBookLibraryContract(_privateKey) {
    await hre.run("compile"); // We are compiling the contracts using subtask
    const wallet = new ethers.Wallet(_privateKey, hre.ethers.provider); // New wallet with the privateKey passed from CLI as param
    console.log("Deploying contracts with the account:", wallet.address); // We are printing the address of the deployer
    console.log("Account balance:", (await wallet.getBalance()).toString()); // We are printing the account balance

    const Library = await ethers.getContractFactory("Library", wallet); // Get the contract factory with the signer from the wallet created
    const libraryContract = await Library.deploy();
    console.log("Waiting for BookLibrary deployment...");
    await libraryContract.deployed();

    console.log("Library Contract address: ", libraryContract.address);
    console.log("Done!");
}

module.exports = deployBookLibraryContract;
