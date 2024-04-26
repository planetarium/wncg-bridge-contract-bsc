@ Step 0: Deploy DEMO ERC20 Contract:
npx hardhat run scripts/deploy_DEMO.js --network bsc_testnet
npx hardhat run scripts/deploy_DEMO.js --network bsc_mainnet

@ Step 1: Deploy Bridge contracts:
npx hardhat run scripts/deploy_BridgeBSC.js --network bsc_testnet
npx hardhat run scripts/deploy_BridgeBSC.js --network bsc_mainnet

@ Step 2: Verify Bridge contracts:
npx hardhat run scripts/bsc_testnet_verify.js --network bsc_testnet
npx hardhat run scripts/bsc_mainnet_verify.js --network bsc_mainnet

npx hardhat run scripts/bsc_upgrade_contract --network bsc_testnet
