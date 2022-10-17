const hre = require("hardhat");
const ethers = hre.ethers;

async function deployLibraryContract() {
    await hre.run("compile"); // We are compiling the contracts using subtask
    const [deployer] = await ethers.getSigners(); // We are getting the deployer

    await hre.run("print", {
        message: "Deploying contracts with the account:" + deployer.address,
    }); // We are printing the address of the deployer
    await hre.run("print", {
        message: "Account balance:" + (await deployer.getBalance()).toString(),
    }); // We are printing the account balance

    const bookLibrary = await ethers.getContractFactory("Library"); // Get the contract factory with the signer from the wallet created
    const bookLibraryContract = await bookLibrary.deploy();
    await hre.run("print", {
        message: "Waiting for bookLibrary deployment...",
    });
    await bookLibraryContract.deployed();

    await hre.run("print", {
        message:
            "Deployed BookLibrary on contract address: " +
            bookLibraryContract.address,
    });
    try {
        await hre.run("verify:verify", {
            address: bookLibraryContract.address,
            constructorArguments: [],
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("recently deployed") ||
            e.message.toLowerCase().includes("already verified")) {
            await hre.run("print", { message: "Validation failed." });
        } else {
            await hre.run("print", { message: e });
        }
    }
    await hre.run("print", { message: "Verified." });
    await hre.run("print", { message: "Done!" });
}

module.exports = deployLibraryContract;
