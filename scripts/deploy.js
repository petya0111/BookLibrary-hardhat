const hre = require("hardhat")
const ethers = hre.ethers

async function deployLibraryContract() {
    await hre.run("compile") // We are compiling the contracts using subtask
    const [deployer] = await ethers.getSigners() // We are getting the deployer

    console.log("Deploying contracts with the account:", deployer.address) // We are printing the address of the deployer
    console.log("Account balance:", (await deployer.getBalance()).toString()) // We are printing the account balance

    const bookLibrary = await ethers.getContractFactory("Library") // Get the contract factory with the signer from the wallet created
    const bookLibraryContract = await bookLibrary.deploy()
    console.log("Waiting for bookLibrary deployment...")
    await bookLibraryContract.deployed()

    console.log("bookLibrary Contract address: ", bookLibraryContract.address)
    console.log("Done!")
    await hre.run("verify:verify", {
        address: bookLibraryContract.address,
        constructorArguments: [],
    })
    await hre.run("print", { message: "Verified." })
}

module.exports = deployLibraryContract
