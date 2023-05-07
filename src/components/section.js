import {ethers} from 'ethers'
import React from 'react';
import Rating from './rating';


export default function Section({title,items,togglePop}){
    return(
        <div className='cards_section'>
            <h3 id={title}>{title}</h3>
            <hr/>
            <div className='cards'>
                {
                    items.map((item,index)=>(
                        <div className='card' key={index} onClick={()=>togglePop(item)}>
                        <div className='card_image'>
                            <img src={item.image} alt='item'/>
                        </div>
                        <div className='card_info'>
                            <h4>{item.name}</h4>
                            <Rating value={item.rating}/>
                            <p>{ethers.utils.formatUnits(item.cost.toString(),'ether')} ETH</p>
                        </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}