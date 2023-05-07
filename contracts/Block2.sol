// SPDX-License-Identifier:UNLICENSED 
pragma solidity ^0.8.9;
contract Block2{
    //create a state variable that stores name of the smart contract
  
    address public owner;

    constructor(){
        owner=msg.sender;
    }
//create item struct (this is created only in memory) 
    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    //create struct for order
    struct Order{
        uint256 time;
        Item item;
    }
 

    //mapping 
    mapping(uint256=>Item)public items;
    mapping(address=>uint256)public orderCount;
    mapping(address=>mapping(uint256=>Order))public orders;

    // define your events in solidity like structs
    event List(string name, uint256 cost, uint256 quantity);
    event Buy(address buyer,uint256 orderId,uint256 itemId);

    modifier onlyOwner(){
        require(msg.sender==owner);
        _;
    }
   


    //list products
    function list(
        uint256 _id,
        string memory _name, 
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock)public onlyOwner{

            

            Item memory item=Item(_id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock);

    //saving to the blockchain
     items[_id]=item;

     //emit/trigger an event
    emit List(_name,_cost,_stock);

    }
    //buy products
    function buy(uint256 _id)public payable{
        //fetch tem
        Item memory item=items[_id];

        //require enough ether to buy item
        require(msg.value>=item.cost);

        //require item is in stock
        require(item.stock>0);
        //create an order
        Order memory order=Order(block.timestamp,item);

        //save order to chain
        orderCount[msg.sender]=orderCount[msg.sender]+1;//<--orderID
        orders[msg.sender][orderCount[msg.sender]]=order;

        //subtract stock
        items[_id].stock=item.stock-1;

        //emit an event
        emit Buy(msg.sender,orderCount[msg.sender],item.id);
    }
    //withdraw funds
    function withdraw() public onlyOwner{
        (bool success,)=owner.call{value:address(this).balance}("");
        require(success);
    }

}