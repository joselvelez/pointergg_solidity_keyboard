async function main() {
    const [owner, someoneElse] = await hre.ethers.getSigners();
    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();
  
    console.log("Contract deployed to:", keyboardsContract.address);
  
    const keyboardTxn1 = await keyboardsContract.create(0, true, "sepia");
    await keyboardTxn1.wait();

    const keyboardTxn2 = await keyboardsContract.connect(someoneElse).create(1, false, "grayscale");
    const keyboardTxnReciept = await keyboardTxn2.wait();
    console.log(keyboardTxnReciept.events);

    const balanceBefore = await hre.ethers.provider.getBalance(someoneElse.address);
    console.log(`Someone else's balance before: ${hre.ethers.utils.formatEther(balanceBefore)}`);

    const tipTxn = await keyboardsContract.tip(1, {value: hre.ethers.utils.parseEther("1000")});
    const tipTxnReceipt = await tipTxn.wait();
    console.log(tipTxnReceipt.events);

    const balanceAfter = await hre.ethers.provider.getBalance(someoneElse.address);
    console.log(`Someone else's balance after: ${hre.ethers.utils.formatEther(balanceAfter)}`);

    let keyboards;

    keyboards = await keyboardsContract.getKeyboards();
    // const keyboards = await keyboardsContract.createdKeyboards;
    console.log("We got the keyboards!", keyboards);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  