const hre=require("hardhat")
const{items}=require("../src/items.json")


const tokens=(n)=>{
    return ethers.utils.parseUnits(n.toString(),'ether')
}
async function main(){
    const [deployer]=await ethers.getSigners()
    const Block2=await hre.ethers.getContractFactory("Block2")
    const block2=await Block2.deploy()
    await block2.deployed()
    console.log(`deployed Block2 Contract at:${block2.address}\n`)

    //list items
    for(let i=0;i<items.length;i++){
        const transaction =await block2.connect(deployer).list(
            items[i].id,
            items[i].name,
            items[i].category,
            items[i].image,
            tokens(items[i].price),
            items[i].rating,
            items[i].stock,
        )
        await transaction.wait()
            console.log(`listed items ${items[i].id}:${items[i].name}`)
    }

}

main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
})