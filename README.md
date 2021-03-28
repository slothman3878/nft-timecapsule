# NFT Timecapsule

The Timecapsule contract extends <a href="https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721">Openzeppelin's ERC721</a> contract (version 3.4.0). <br>
Tested and deployed using <a href="https://hardhat.org/">Hardhat</a>. <br>
Messages in the capsules themselves are uploaded to IPFS. <br>
Currently deployed onto the Kovan network. <br>
Frontend can be found <a href="https://github.com/slothmanxyz/nft-timecapsule-demo">here</a>.
Demo can be found <a href="https://slothmanxyz.github.io/nft-timecapsule-demo">here</a>.

### Features:

- ```registerTimeCapsule(dueDate, uri, desc)``` creates a timecapsule with the given duedate. ```uri``` is the ipfs hash for the message stored in the capsule. ```desc``` contains the the title for the capsule (```desc``` not implemented on the frontend, currently).
- The hash to the message is accessed by ```tokenURI(id)``` where ```id``` is the token id. If the current date (given by ```block.timestamp```) is behind the duedate, the hash cannot be accessed.
- In case of circumstances the user ever needs to move up the capsule due date, it can be done by ```resetDueDate(id, newDueDate, fee)``` which requires the user to pay at around **1e16 gwei per day**; i.e. if the user wants to open a capsule three days earlier than the original duedate, they have to pay around **0.03 ether**.
- The fee for changing the due date can be calculated with ```calculateResetFee(id, newDueDate)```.

### TODOs:

- Deploy on to rinkeby network.
- Cleanup frontend.