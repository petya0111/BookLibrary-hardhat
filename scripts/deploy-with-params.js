const hre = require('hardhat')
const ethers = hre.ethers;

async function deployElectionContract(_privateKey) {
    await hre.run('compile'); // We are compiling the contracts using subtask
    const wallet = new ethers.Wallet(_privateKey, hre.ethers.provider) // New wallet with the privateKey passed from CLI as param
    console.log('Deploying contracts with the account:', wallet.address); // We are printing the address of the deployer
    console.log('Account balance:', (await wallet.getBalance()).toString()); // We are printing the account balance

    const bookLibrary = await ethers.getContractFactory("Library", wallet); // Get the contract factory with the signer from the wallet created
    const bookLibraryContract = await bookLibrary.deploy();
    console.log('Waiting for bookLibrary deployment...');
    await bookLibraryContract.deployed();

    console.log('bookLibrary Contract address: ', bookLibraryContract.address);
    console.log('Done!');
    let verification = await hre.run("verify:verify", {
        address: bookLibraryContract.address,
        constructorArguments: [
        ],
    });
    await hre.run('print', { message: verification })
}
  
module.exports = deployElectionContract;