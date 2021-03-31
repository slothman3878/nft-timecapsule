# NFT Timecapsule

The ```Timecapsule.sol``` contract extends <a href="https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721">Openzeppelin's ERC721</a> contract (version 3.4.0). <br>
Tested and deployed using <a href="https://hardhat.org/">Hardhat</a> and <a href="https://alchemyapi.io">Alchemy</a>. <br>
Messages in the capsules themselves are uploaded to IPFS. <br>
Currently deployed onto the Rinkeby network. <br>
Frontend can be found <a href="https://github.com/slothmanxyz/nft-timecapsule-demo">here</a>. <br>
Working demo can be found <a href="https://slothmanxyz.github.io/nft-timecapsule-demo">here</a>.

## Features

- ```registerTimeCapsule(dueDate, uri, desc)``` creates a timecapsule with the given duedate. ```uri``` is the ipfs hash for the message stored in the capsule. ```desc``` contains the the title for the capsule (```desc``` not implemented on the frontend, currently).
- The hash to the message is accessed by ```tokenURI(id)``` where ```id``` is the token id. If the current date (given by ```block.timestamp```) is behind the duedate, the hash cannot be accessed.
- In case the user ever needs to move up the capsule due date due to circumstances, it can be done by ```resetDueDate(id, newDueDate, fee)``` which requires the user to pay at around **1e16 gwei per day**; i.e. if the user wants to open a capsule three days earlier than the original duedate, they have to pay around **0.03 ether**.
- The fee for changing the due date can be calculated with ```calculateResetFee(id, newDueDate)```.
- The title for capsules can be accessed at any time, regardless of the due date.
- All capsules are private. Only the owner can access its content (provided the ipfs hash isn't compromised).

## TODOs

- Further cleanup frontend.

## Miscellaneous Thoughts (Limitations to current design)

* Because the messages are stored on IPFS, preservation of the capsules is not guaranteed. Pinning using third party services like <a href="https://pinata.cloud">Pinata</a> is a possible option, but because the hashes themselves are hidden from the users, the users themselves have no way of ensuring their messages from disappearing.
* The title for capsules is limited to 60 characters (or will be), but limitation is dealt by on the frontend and not by the contract itself.
* If the ipfs hash is compromised, the message is becomes available prematurely and publicly. Could be solved by creating a message encryption library contract and store the private keys in the main time capsule contract and have the keys be available only after the due date has been passed.
