# Book library Hardhat Project

This project demonstrates a Book Library contracts. 

## Execute tasks for local setup

Install the dependencies

```shell
npm install
```

Compile the contracts
```shell
npx hardhat compile
```

> Create .env file with keys from .env.example. By default network is goerli so put private key from goerli network.

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

Deploying on testnet networks
```shell
npx hardhat deploy-testnets --network goerli
```