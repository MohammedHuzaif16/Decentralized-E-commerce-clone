import { useEffect,useState } from "react";
import React from "react";
import { ethers } from "ethers";

import Rating from "./rating";

import close from '../assets/close.svg'

export default function Product({item,provider,account,block2,togglePop}){
    const [order,setOrder]=useState(null)
    const [hasBought,setHasBought]=useState(false)

    const fetchDetails=async()=>{
        const events=await block2.queryFilter("buy")
        const orders=events.filter(
            (event)=>event.args.buyer===account&&event.args.itemId.toString()===item.id.toString()
        )
        if(orders.length===0)return
        const order= await block2.orders(account,orders[0].args.orderId)
        setOrder(order)
    }
    const buyHandler=async()=>{
        const signer=await provider.getSigner()

        //buy items
        let transaction=await block2.connect(signer).buy(item.id,{value: item.cost})
    await transaction.wait()
    setHasBought(true)
    }
    useEffect(()=>{
        fetchDetails()
    },[hasBought])
    return(
        <div className="product">
            <div className="product_details">
                <div className="product_image">
                    <img src={item.image} alt='product'/>

                </div>
                <div className="product_overview">
                    <h1>{item.name}</h1>
                    <Rating value={item.rating}/>
                    <hr/>
                    <p>{item.address}</p>
                    <h2>{ethers.utils.formatUnits(item.cost.toString(),'ether')} ETH</h2>
                    <hr/>
                    <h2>Overview</h2>
                    <p>{item.description}</p>
                </div>
                <div className="product_order">
                    <h1>{ethers.utils.formatUnits(item.cost.toString(),'ether')} ETH</h1>
                    <p>
                        FREE DELIVERY<br/>
                        <strong>
                            {new Date(Date.now()+345600000).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}

                        </strong>
                    </p>
                    {item.stock>0?(
                        <p>In Stock.</p>):(
                            <p>Out Of Stock</p>
                        )
                    }
                    <button className="product_buy" onClick={buyHandler}>
                        BUY NOW
                    </button>
                    <p><small>Ships from </small>DEcom</p>
                    <p><small>Sold By </small>DEcom</p>
                    {order&&(
                        <div className="product_bought">
                        Item bought on <br/>
                        <strong>{
                        new Date(Number(order.time.toString()+'000')).toLocaleDateString(
                            undefined,
                            {
                                weekday:'long',
                                hour:'numeric',
                                minute:'numeric',
                                second:'numeric'})}
                                </strong>
                        </div>
                    )}
                </div>
                <button onClick={togglePop} className='product_close'>
                    <img src={close} alt='close'/>

                </button>
            </div>
        </div>
    )

}