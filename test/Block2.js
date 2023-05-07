const {expect}=require('chai')


const tokens=(n)=>{
    return ethers.utils.parseUnits(n.toString(),'ether')
}
//GLOBAL CONSTANTS FOR LISTING AN ITEM
const ID=1
const NAME='Shoes'
const CATEGORY="Clothing"
const IMAGE="https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const COST=tokens(1)
const RATING=4
const STOCK=5

describe('Block2',()=>{
    let deployer,buyer
    let block2 
    beforeEach(async()=>{

    //setup accounts
    [deployer,buyer]= await ethers.getSigners()

    console.log(deployer.address)
    // go fetch the smart contact called block and store it
    const Block2=await ethers.getContractFactory('Block2')
    //deploy it to a test network
    block2=await Block2.deploy()
    })

    describe("Deployment",()=>{
        it("Sets the owner",async()=>{
            expect(await block2.owner()).to.equal(deployer.address)
        })
    })
    
    describe("Listing",()=>{
        let transaction


        beforeEach(async()=>{
            transaction = await block2.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK
            )
            //CALLING FUNCTION FOR LISTING
            await transaction.wait()
            })

        it("Returns item attributes",async()=>{
            const item=await block2.items(ID)
            expect(item.id).to.equal(ID)
            expect(item.name).to.equal(NAME)
            expect(item.category).to.equal(CATEGORY)
            expect(item.image).to.equal(IMAGE)
            expect(item.cost).to.equal(COST)
            expect(item.rating).to.equal(RATING)
            expect(item.stock).to.equal(STOCK)
        })
        it("Emits List event",()=>{
            expect(transaction).to.emit(block2,'list')
        })
    })
    describe("Buying",()=>{
        let transaction
        beforeEach(async()=>{
            //list an item
            transaction = await block2.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
            //CALLING FUNCTION FOR LISTING
            await transaction.wait()

            //buy an item
            transaction=await block2.connect(buyer).buy(ID,{value:COST})
            })


        it("Updates the contract balance", async()=>{
            const result=await ethers.provider.getBalance(block2.address)
            expect(result).to.equal(COST)
        })
        it("Updates buyers order count", async()=>{
            const result=await block2.orderCount(buyer.address)
            expect(result).to.equal(1)
        })
        it("Adds the order",async()=>{
            const order= await block2.orders(buyer.address,1)
            expect(order.time).to.be.greaterThan(0)
            expect(order.item.name).to.equal(NAME)
        })
        it("Emits Buy Event",()=>{
            expect(transaction).to.emit(block2,"Buy")
        })
    })
    describe("withdrawing",()=>{
        let balanceBefore

        beforeEach(async()=>{
            let transaction=await block2.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST,RATING,STOCK)
            await transaction.wait()

            //buy an item
            transaction=await block2.connect(buyer).buy(ID, {value:COST})
            await transaction.wait()

            //get deployer balance before
            balanceBefore=await ethers.provider.getBalance(deployer.address)

            //withdraw
            transaction=await block2.connect(deployer).withdraw()
            await transaction.wait()
        })
        it('Updates the owners balance',async()=>{
            const balanceAfter=await ethers.provider.getBalance(deployer.address)
            expect(balanceAfter).to.be.greaterThan(balanceBefore)
        })

        it("Updates the contract balance",async()=>{
            const result=await ethers.provider.getBalance(block2.address)
            expect(result).to.equal(0)
        })
    })


})
