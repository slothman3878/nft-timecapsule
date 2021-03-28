async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const TimeCapsule = await ethers.getContractFactory("TimeCapsule");
  const timeCapsule = await TimeCapsule.deploy();

  console.log("Contract address:", timeCapsule.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });