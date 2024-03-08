[![codecov](https://codecov.io/gh/planetarium/staking_contract_wncg_bsc/graph/badge.svg?token=2jZGFyR47E)](https://codecov.io/gh/planetarium/staking_contract_wncg_bsc)

How to setup dev environment

```
$ node --version
v16.15.0
```

1. Create `.env` file with these keys
```shell
INFURA_API_KEY=     # Infura api key
BSCSCAN_API_KEY=    # BSC Scan api key
PRI_KEY1=           # Private Key of your metamask

# Staking Rewards (BSC testnet)
STAKED_TOKEN=       # Staked Token Address
REWARD_TOKEN=       # Reward Token Address
REWARDS_VAULT=      # Reward Vault Address
OPERATOR=           # Operator Address
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

