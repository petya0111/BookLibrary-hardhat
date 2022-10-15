# Book library Hardhat Project

This project demonstrates a Book Library contracts. 

> **_NOTE:_**  Contract is already deployed in Goerli testnet - bookLibrary Contract address: 0xA67EC72bC44877e13808332323e6ba4A6Ba4E58B

## Execute tasks for local setup

Install the dependencies

```shell
npm install
```

Compile the contracts
```shell
npx hardhat compile
```

Run local network with test accounts
```shell
npx hardhat node
```

Run tests with high coverage. Unit tests are typically run on hardhat networks or ganache.
```shell
npm run test
```

Run tests coverage. 
```shell
npm run coverage
```

#### Create .env file with keys from .env.example. By default network is goerli so put private key from goerli network.

Deploying on testnet networks
```shell
npx hardhat deploy-testnets --network goerli
```

Deploying on mainnet networks
```shell
npx hardhat deploy-mainnet --private-key 0x
```