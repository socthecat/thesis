# Diploma Issuing Thing

**Diploma Issuing Thing** is a web3 dApp built around the concept of issuing diplomas/certificates to students as a way to prove that they indeed have the qualifications they claim to have.

First, a diploma/certificate is minted to the institution's address (which is also the contract's owner), then it can be sent to the student's wallet. After this, the transaction is complete.

You can check this project out live: https://diploma-issuing.netlify.app/. Note that you can use it only if you're the contract owner.

## Viewing the project locally

First, install all of the dependencies using `npm ci`.

### Deploying the smart contract

1. Run `npx hardhat compile`.
2. Open another terminal and run `npx hardhat node`. This needs to run in the background all the time.
3. Install MetaMask. Switch to the localhost network.
4. Import a wallet from the `npx hardhat node` terminal into MetaMask.
5. Go to hardhat.config.js, copy the private key from the same wallet and paste it into the `accounts` field in the `localhost` object.
6. In MetaMask, go to Settings -> Networks -> Localhost and change the chain id to 31337. [Here's why you should do this](https://github.com/MetaMask/metamask-extension/issues/10290).
7. Run `npx run scripts/deploy.js --network localhost`.

### Deploying the frontend

This project uses [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.

1. Install Angular globally using `npm install -g @angular/cli`.
2. Run `ng serve`.
3. Navigate to `http://localhost:4200/`.
