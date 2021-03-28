const { expect } = require('chai');
const { waffle } = require('hardhat');

let provider = waffle.provider;

describe("AutographDapp contract", function() {
    let one = ethers.utils.parseEther("1.0");

    // ContracFactory
    let TimeCapsule;

    // accounts
    let account1;
    let account2;
    let account3;

    // TimeCapsule
    let instance;

    // instances for TimeCapsule Contracts
    let timeCapsules = {};

    // ids of requests
    let tokenIds = {};

    // to be reset after each test (from the 2nd test)
    let balanceBeforeTransaction = {};

    var timestamp;

    // 0x021e19e0c9bab2400000 gwei is the base ammount
    beforeEach(async function() {
        [account1, account2, account3] = await ethers.getSigners();
        TimeCapsule = await ethers.getContractFactory("TimeCapsule");
    
        instance = await TimeCapsule.deploy();
        await instance.deployed();

        timeCapsules.account1 = await instance.connect(account1);
        timeCapsules.account2 = await instance.connect(account2);
        timeCapsules.account3 = await instance.connect(account3);

        timestamp = await (await provider.getBlock(await provider.getBlockNumber())).timestamp;
    });

    it("Deployment should return Time Capsule with name and symbol as given", async function() {
        expect(await instance.name()).to.equal("Time Capsule");
        expect(await instance.symbol()).to.equal("TCC");
    });

    it("Time Capsule for account 1. Due date before now.", async function() {
        var receipt = await (await timeCapsules.account1.registerTimeCapsule(1,"hello world")).wait();
        var newEvents = receipt.events?.filter((x)=>{return x.event=='NewTimeCapsule'});
        var id = newEvents[newEvents.length-1].args.id;
        var client = newEvents[newEvents.length-1].args.client;
        var dueDate = newEvents[newEvents.length-1].args.dueDate;
        expect(await instance.dueDate(id)).to.equal(1);
        expect(await instance.ownerOf(id)).to.equal(client);
        expect(await instance.ownerOf(id)).to.equal(account1.address);
        expect(await timeCapsules.account1.tokenURI(id)).to.equal("hello world");
        try {
            await timeCapsules.account2.tokenURI(id);
        }catch(err){
            expect(err.message).to.contain.oneOf(['TimeCapsule']);
        }
    });

    it("Time Capsule for account 2. Due date after now.", async function() {
        var receipt = await (await timeCapsules.account2.registerTimeCapsule(timestamp*2, "hello world")).wait();
        var newEvents = receipt.events?.filter((x)=>{return x.event=='NewTimeCapsule'});
        var id = newEvents[newEvents.length-1].args.id;
        
        try {
            await timeCapsules.account2.tokenURI(id);
        }catch(err){
            //console.log(err.message);
            expect(err.message).to.contain.oneOf(['TimeCapsule']);
        };
    });

    it("Time Capsule for account 3. Pays 1 ether for new due date", async function() {
        var day = ethers.BigNumber.from(86400);

        var receipt = await(await timeCapsules.account3.registerTimeCapsule(timestamp+day*6, "hello world")).wait();
        var newEvents = receipt.events?.filter((x)=>{return x.event=='NewTimeCapsule'});
        var id = newEvents[newEvents.length-1].args.id;
        var dueDate = newEvents[newEvents.length-1].args.date;
        var newDueDate = dueDate-day*3;
        //Three days after now, three days before then. Hence, the fee should be a three day penalty.

        try{
            await timeCapsules.account3.resetDueDate(id,newDueDate,one.div(100),{value:one.div(100)});
        }catch(err){
            console.log(err.message);
            expect(err.message).to.contain.oneOf(['TimeCapsule']);
        };

        
        receipt = await(await timeCapsules.account3.resetDueDate(id,newDueDate,one.div(100).mul(3),{value:one.div(100).mul(3)})).wait();
        newEvents = receipt.events?.filter((x)=>{return x.event=='DueDateReset'});
        id = newEvents[newEvents.length-1].args.id;
        dueDate = newEvents[newEvents.length-1].args.date;

        expect(dueDate).to.equal(newDueDate);

        newDueDate = dueDate-day*4;
        //A day before now, and three days before then. Hence, the fee should be a three day penalty


        try{
            await timeCapsules.account3.resetDueDate(id,newDueDate,one.div(100),{value:one.div(100)});
        }catch(err){
            console.log(err.message);
        };

        receipt = await(await timeCapsules.account3.resetDueDate(id,newDueDate,one.div(100).mul(3),{value:one.div(100).mul(3)})).wait()
        newEvents = receipt.events?.filter((x)=>{return x.event=='DueDateReset'});
        id = newEvents[newEvents.length-1].args.id;
        dueDate = newEvents[newEvents.length-1].args.date;

        expect(await timeCapsules.account3.tokenURI(id)).to.equal("hello world");
    });
  });