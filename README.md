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

Run tests with high coverage. For example on localhost network after you have run local node.
```shell
npx hardhat test --network localhost
```

Test deploying on testnet networks
```shell
npx hardhat deploy-param-privateKey --network goerli --private-key <YOUR private key>
npx hardhat deploy-param-privateKey --network rinkeby --private-key <YOUR private key>
```