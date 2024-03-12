[![codecov](https://codecov.io/gh/planetarium/wncg-bridge-contract-bsc/graph/badge.svg?token=2jZGFyR47E)](https://codecov.io/gh/planetarium/wncg-bridge-contract-bsc)

How to setup dev environment

```
$ node --version
v20.4.0
```

1. Create `.env` file with these keys
```shell
MNEMONIC=
ETHERSCAN_API_KEY=
BSCSCAN_API_KEY=

TRANSFER_TOKEN=
OPERATOR=
```

2. Clean Cache & Install npm packages
```shell
# Clean cache
rm -rf node_modules;
rm -f package-lock.json;
npm cache clean --force;

# Install npm packages
npm i
```

3. Compile contracts
```shell
# Compile
npx hardhat compile
```

4. run unit test and coverage report
```shell
npx hardhat test
npx hardhat coverage
```

5. deploy
```shell
npx hardhat run scripts/deploy_BridgeBSC.js --network bsc_testnet
```


