@ Step 0: Deploy DEMO ERC20 Contract:
npx hardhat run scripts/deploy_DEMO.js --network bsc_testnet

@ Step 1: Deploy Bridge contracts:
npx hardhat run scripts/deploy_BridgeBSC.js --network bsc_testnet

@ Step 2: Verify Bridge contracts:
npx hardhat run scripts/bsc_testnet_verify.js --network bsc_testnet
